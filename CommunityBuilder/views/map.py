import flask
import CommunityBuilder


@CommunityBuilder.app.route('/map/', methods=['GET'])
def show_map():
    """Display / route."""
    # flask.session['username'] = 'JohnS'
    return flask.render_template("index.html", **{'logname': flask.session['username']})