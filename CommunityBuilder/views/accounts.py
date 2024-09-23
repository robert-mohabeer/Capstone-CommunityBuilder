import flask
import CommunityBuilder

@CommunityBuilder.app.route('/accounts/', methods=["GET"])
def show_login():
    """Display / route."""
    if 'username' in flask.session:
        return flask.redirect(flask.url_for('show_index'))

    return flask.render_template("login.html")


@CommunityBuilder.app.route('/accounts/', methods=['POST'])
def accounts_redirect():
    """Handle account rereouting and rediction on POST requests."""
    if flask.request.form['operation'] == 'login':
        return handle_login()
    if flask.request.form['operation'] == 'create':
        return handle_create_user()

    return flask.redirect(flask.url_for("show_login"))


def handle_login():
    """Handles the password checking for loginning a user."""
    if flask.request.form.get('username') is None or not flask.request.form['username'] or \
        flask.request.form.get('password') is None or not flask.request.form['password']:
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    password_fetch = connection.execute(
        "SELECT password FROM users "
        "WHERE username = ?",
        [flask.request.form['username']]).fetchone()

    if password_fetch is None:
        flask.abort(403)

    if password_fetch["password"] != flask.request.form["password"]:
        flask.abort(403)

    flask.session["username"] = flask.request.form["username"]
    CommunityBuilder.model.close_db(True)
    return flask.redirect(flask.url_for("show_index"))



def handle_create_user():
    """Handles the POST request to create a user."""
    if flask.request.form.get('username') is None or \
            flask.request.form.get('fullname') is None or \
            flask.request.form.get('email') is None or \
            flask.request.form.get('password') is None:
        flask.abort(400)

    if not flask.request.form['username'] or \
            not flask.request.form['fullname'] or \
            not flask.request.form['email'] or \
            not flask.request.form['password']:
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    if connection.execute(
        "SELECT username from users "
        "WHERE username = ?",
        [flask.request.form['username']]
    ).fetchone() is not None:
        flask.abort(409)

    # get filename
    fileobj = flask.request.files['filename']
    filename = fileobj.filename
    path = CommunityBuilder.app.config["UPLOAD_FOLDER"]/filename
    fileobj.save(path)

    connection.execute(
        "INSERT INTO users(username, fullname, email, filename, password, age, about_me) "
        "VALUES (?,?,?,?,?,?,?) ",
        [flask.request.form['username'],
         flask.request.form['fullname'],
         flask.request.form['email'],
         filename,
         flask.request.form['password'],
         flask.request.form['age'],
         flask.request.form['about_me']]
    )

    flask.session["username"] = flask.request.form["username"]

    CommunityBuilder.model.close_db(True)
    return flask.redirect(flask.url_for("show_index"))


@CommunityBuilder.app.route('/accounts/logout/')
def user_logout():
    """Log out User."""
    flask.session.pop('username')
    print("----------hey----------")
    #if 'username' in flask.session:
    return flask.redirect(flask.url_for('show_login'))