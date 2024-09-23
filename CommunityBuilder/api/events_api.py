"""REST API for events."""
import flask
import CommunityBuilder

@CommunityBuilder.app.route('/api/v1/events/', methods=['GET'])
def get_events():
    """Return 10 newest event urls and ids.

    Example:
    {
        "next": "",
        "rsvped_events": [
            {
                "eventid": 3,
                "url": "/api/v1/events/3/"
            },
            {
                "eventid": 2,
                "url": "/api/v1/events/2/"
            }
        ],
        "all_events": [
            {
                "eventid": 3,
                "url": "/api/v1/events/3/"
            },
            {
                "eventid": 2,
                "url": "/api/v1/events/2/"
            },
            {
                "eventid": 1,
                "url": "/api/v1/events/1/"
            }
        ],
        "url": "/api/v1/events/"
    }
    """
    if "username" not in flask.session:
        flask.abort(403)

    connection = CommunityBuilder.model.get_db()
    filters = flask.request.args.get("filters",
                                        default="", type=str)
    if filters != "":
        filter_array = filters.split(",")
    else:
        filter_array = []

    fetch_rsvp_events = connection.execute(
            "SELECT eventid "
            "FROM rsvps WHERE owner = ? ORDER BY eventid",
            [flask.session['username']]
        ).fetchall()
    fetch_rsvp_events = set([event["eventid"] for event in fetch_rsvp_events])

    fetch_all_events = connection.execute(
        "SELECT eventid FROM events ORDER BY eventid"
    ).fetchall()
    fetch_all_events = set([event['eventid'] for event in fetch_all_events])

    for filter_label in filter_array:
        fetch_filter = connection.execute(
            "SELECT eventid "
            "FROM event_labels WHERE label = ?",
            [filter_label]).fetchall()
        fetch_filter = set([event["eventid"] for event in fetch_filter])
        #fetch_rsvp_events = fetch_rsvp_events.intersection(fetch_filter)
        fetch_all_events = fetch_all_events.intersection(fetch_filter)
        if len(fetch_all_events) == 0 and len(fetch_rsvp_events) == 0:
            break

    context = {
        "rsvped_events": [{"eventid": event, "url": f"/api/v1/events/{event}/"}
                          for event in fetch_rsvp_events],
        "all_events": [{"eventid": event, "url": f'/api/v1/events/{event}/'}
                        for event in fetch_all_events],
        "url": flask.request.url
    }

    return flask.make_response(flask.jsonify(**context), 200)

@CommunityBuilder.app.route('/api/v1/events/<int:eventid_url_slug>/', methods=['GET'])
def get_event(eventid_url_slug):
    """Return event on eventid.

    Example:
    {
        "comments": [
            {
                "commentid": 1,
                "lognameOwnsThis": true,
                "owner": "awdeorio",
                "ownerShowUrl": "/users/awdeorio/",
                "text": "#chickensofinstagram",
                "url": "/api/v1/comments/1/"
            }
            ...
        ],
        "eventId": 8,
        "title": "ex_title",
        "date": "10-07-2001",
        "time": "8:30 PM",
        "location": "Ann arbor coffee place",
        "address": "100 State St Ann Arbor",
        "rsvped": true,
        "rsvped_url": "/api/v1/rsvp/6/",
        "owner": "skstaid",
        "numPeople": 8,
        "url": "/api/v1/events/8/"
        "userOwned: False
    }
    """
    # if 'username' not in flask.session:
    #     flask.abort(403)

    username = flask.session['username']
    connection = CommunityBuilder.model.get_db()
    fetch_event = connection.execute(
        "SELECT * FROM events WHERE eventid = ?",
        [eventid_url_slug]
    ).fetchone()

    if fetch_event is None:
        flask.abort(500)

    context = {
        "eventid": fetch_event['eventid'],
        "title": fetch_event["title"],
        "description": fetch_event["description"],
        "date": fetch_event['date'],
        "time": fetch_event['time'],
        "location": fetch_event['location'],
        "address": fetch_event["address"],
        "rsvped": False,
        "rsvp_id": -1,
        "numPeople": 0,
        "owner": fetch_event["owner"],
        "comments_url": f"/api/v1/comments/?eventid={fetch_event['eventid']}",
        "url": f"/api/v1/events/{fetch_event['eventid']}/",
        "userOwned": username == fetch_event["owner"],
        "mapcoord1": fetch_event["mapcoord1"],
        "mapcoord2": fetch_event["mapcoord2"],
    }

    fetch_rsvps = connection.execute(
        "SELECT COUNT(eventid) as num_rsvp "
        "FROM rsvps WHERE eventid = ? GROUP BY eventid",
        [eventid_url_slug]
    ).fetchone()
    if fetch_rsvps is not None:
        context['numPeople'] = fetch_rsvps['num_rsvp']

    fetch_user_rsvp = connection.execute(
        "SELECT rsvpid "
        "FROM rsvps "
        "WHERE owner = ? AND eventid = ?",
        [username, eventid_url_slug]
    ).fetchone()
    if fetch_user_rsvp is not None:
        context['rsvped'] = True
        context['rsvp_id'] = fetch_user_rsvp['rsvpid']

    fetch_filter = connection.execute(
        "SELECT label "
        "FROM event_labels WHERE eventid = ?",
        [eventid_url_slug]).fetchall()
    context["filters"] = fetch_filter
    fetch_rsvpers = connection.execute(
        "SELECT owner, rsvpid "
        "FROM rsvps "
        "WHERE eventid = ?",
        [eventid_url_slug]
    )
    context["rsvpers"] =  [{
        "owner": rsvp['owner'],
        "rsvpid": rsvp['rsvpid'],
        } for rsvp in fetch_rsvpers]


    fetch_comments = connection.execute(
        "SELECT text, owner, commentid "
        "FROM comments WHERE eventid = ? "
        "ORDER BY commentid ASC",
        [eventid_url_slug]
    ).fetchall()
    context["comments"] = [{
        "commentid": comment['commentid'],
        "lognameOwnsThis": (username == comment['owner']),
        "owner": comment['owner'],
        "ownerShowUrl": f"/users/{comment['owner']}/",
        "text": comment['text'],
        "url": f"/api/v1/comments/{comment['commentid']}/"
        } for comment in fetch_comments]

    CommunityBuilder.model.close_db(True)
    return flask.make_response(flask.jsonify(**context), 200)


@CommunityBuilder.app.route('/api/v1/event/<event_id>/', methods=['DELETE'])
def delete_event(event_id):
    """Handle DELETE request for rsvp with eventid=?.

    204 on Success, 404 if rsvpid does not exist & 403 if user
    does not own the rsvp.
    """
    if 'username' not in flask.session:
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    username = flask.session['username']

    fetch_event = connection.execute(
        "SELECT * FROM events WHERE eventid = ?",
        [event_id]
    ).fetchone()

    if fetch_event is None:
        flask.abort(500)

    if fetch_event['owner'] != username:
        flask.abort(403)

    connection.execute(
        "DELETE FROM events "
        "WHERE eventid = ?",
        [event_id]
    )

    CommunityBuilder.model.close_db(True)
    return flask.make_response({}, 204)
