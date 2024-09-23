"""
Insta485 users (user_url_slug) view.

URLs include:
/users/<user_url_slug>/
/users/<user_url_slug>/followers/
/users/<user_url_slug>/following/
/following/?target=URL
"""
import flask
import CommunityBuilder
import os


def handle_valid_user(user_url_slug):
    """Check that user_url_slug coresponds to a valid username in database.

    Args:
        user_url_slug (string): username for user

    Returns:
        Flask.Error: throws flask.abort(404) if user_url_slug
        is not a valid username in database.
    """
    connection = CommunityBuilder.model.get_db()
    if connection.execute(
        "SELECT username FROM users WHERE username = ?",
        [user_url_slug]
    ).fetchone() is None:
        CommunityBuilder.model.close_db(True)
        flask.abort(404)
    CommunityBuilder.model.close_db(True)


@CommunityBuilder.app.route('/users/<user_url_slug>/', methods=['GET'])
def show_user(user_url_slug):
    """Display / route."""
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    handle_valid_user(user_url_slug)

    connection = CommunityBuilder.model.get_db()
    # Query database
    fetch_user = connection.execute(
        "SELECT * "
        "FROM users "
        "WHERE username = ?",
        [user_url_slug]
    ).fetchone()

    context = {'logname': flask.session['username'],
               'username': fetch_user['username'],
               'fullname': fetch_user['fullname'],
               'email': fetch_user['email'],
               'filename': fetch_user['filename'],
               "age": fetch_user['age'],
               "about_me": fetch_user['about_me'],
               }

    fetch_events = connection.execute(
        "SELECT eventid, title, description, date, location, address "
        "FROM events "
        "WHERE owner = ?",
        [context['username']]
    ).fetchall()

    context["events"] = [{
        "eventid": event["eventid"],
        "title": event["title"],
        "description": event["description"],
        "date": event["date"],
        "location": event["location"],
        "address": event["address"],
    } for event in fetch_events]

    CommunityBuilder.model.close_db(True)
    return flask.render_template("user.html", **context)

@CommunityBuilder.app.route('/uploads/<filename>', methods=['GET'])
def show_image(filename):
    """Get an image from files."""
    if "username" not in flask.session:
        return flask.abort(403)

    path = CommunityBuilder.app.config['UPLOAD_FOLDER']
    print(path)
    file_path = os.path.join(path, filename)
    if not os.path.exists(file_path):
        flask.abort(404)

    return flask.send_from_directory(path, filename)