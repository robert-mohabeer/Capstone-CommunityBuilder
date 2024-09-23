import flask
import CommunityBuilder

@CommunityBuilder.app.route('/', methods=['GET'])
def show_index():
    """Display / route."""

    if "username" not in flask.session:
        return flask.redirect(flask.url_for("show_login"))
    # flask.session['username'] = 'JohnS'
    context = {"logname": flask.session["username"] }
    print("over")

    return flask.render_template("index.html", **context)

@CommunityBuilder.app.route('/accounts/login/')
def create_login():
    """Display new account creation."""
    return flask.render_template("create_account.html")