"""REST API for creating and deleting rsvps for events."""
import flask
import CommunityBuilder


@CommunityBuilder.app.route('/api/v1/rsvps/', methods=['POST'])
def create_rsvp():
    """Make event request to rsvp photo with eventid=?.

    201 on success and 200 if rsvp already eixsts.
    Example:
    {
        "rsvpid": 6,
        "url": "/api/v1/rsvps/6/"
    }
    """
    if flask.request.args.get('eventid', type=int) is None or 'username' not in flask.session:
        flask.abort(400)

    username = flask.session['username']

    connection = CommunityBuilder.model.get_db()
    fetch_rsvp = connection.execute(
        "SELECT rsvpid "
        "FROM rsvps "
        "WHERE owner = ? AND eventid = ?",
        [username, flask.request.args['eventid']]
    ).fetchone()

    if fetch_rsvp is not None:
        rsvpid = fetch_rsvp['rsvpid']
        exit_status = 200
    else:
        connection.execute(
            "INSERT INTO rsvps(owner, eventid) "
            "VALUES (?, ?)",
            [username, flask.request.args['eventid']]
        )

        rsvpid = connection.execute(
            "SELECT rsvpid "
            "FROM rsvps "
            "WHERE owner = ? AND eventid = ?",
            [username,
             flask.request.args['eventid']]
        ).fetchone()['rsvpid']

        exit_status = 201

    CommunityBuilder.model.close_db(True)
    return flask.make_response(
        flask.jsonify({
            "rsvpid": rsvpid,
            "url": f"/api/v1/rsvps/{rsvpid}/"
        }), exit_status)


@CommunityBuilder.app.route('/api/v1/rsvps/<event_id>/', methods=['DELETE'])
def delete_rsvp(event_id):
    """Handle DELETE request for rsvp with eventid=?.

    204 on Success, 404 if rsvpid does not exist & 403 if user
    does not own the rsvp.
    """
    if 'username' not in flask.session:
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    username = flask.session['username']

    fetch_rsvp = connection.execute(
        "SELECT rsvpid, owner "
        "FROM rsvps "
        "WHERE eventid = ? AND owner = ?",
        [event_id, username]
    ).fetchone()

    if fetch_rsvp is None:
        flask.abort(404)

    if fetch_rsvp['owner'] != username:
        flask.abort(403)

    connection.execute(
        "DELETE FROM rsvps "
        "WHERE eventid = ? AND owner = ?",
        [event_id, username]
    )

    CommunityBuilder.model.close_db(True)
    return flask.make_response({}, 204)
