import flask
from flask import request
import CommunityBuilder

@CommunityBuilder.app.route('/create/')
def show_create():
    """Display / route."""
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context = {"logname":  flask.session['username']}

    #CommunityBuilder.model.close_db(True)
    return flask.render_template("create.html", **context)


@CommunityBuilder.app.route('/create/', methods=["POST"])
def create_event():
    """Create an event."""
    #if 'username' not in flask.session:
        #flask.redirect(flask.url_for("show_login"))

    # flask.session['username'] = "JohnS"

    data = request.get_json()
    eventname = data['eventname']
    location = data['location']
    address = data['address']
    date = data['date']
    time = data['time']
    desc = data['desc']
    mapcoord1 = data['mapcoord1']
    mapcoord2 = data['mapcoord2']
    filters = data['filters']

    if (eventname is None or location is None or address is None
                or date is None or time is None or desc is None):
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    connection.execute(
        "INSERT INTO events(title, description, owner, date, location, address, time, mapcoord1, mapcoord2) "
        "VALUES (?,?,?,?,?,?,?,?,?)",
        (eventname, desc, flask.session['username'], date, location, address, time, mapcoord1, mapcoord2, )
    )

    eventid = connection.execute(
        "SELECT eventid FROM events WHERE eventid = (SELECT last_insert_rowid() FROM events)"
    ).fetchone()["eventid"]

    for label in filters:
        connection.execute(
            "INSERT INTO event_labels(eventid, label) "
            "VALUES (?,?)",
            (eventid, label)
        )

    CommunityBuilder.model.close_db(True)
    return flask.redirect(flask.url_for("show_index"))