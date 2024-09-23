import flask
import CommunityBuilder


@CommunityBuilder.app.route('/event/<eventid_url_slug>', methods=['GET'])
def show_event(eventid_url_slug):
    """Display / route."""
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    # flask.session['username'] = 'JohnS'
    context = {"logname":  flask.session['username']}

    #CommunityBuilder.model.close_db(True)
    return flask.render_template("index.html", **context)
