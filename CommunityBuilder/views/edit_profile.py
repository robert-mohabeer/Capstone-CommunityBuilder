import flask
from flask import request
import CommunityBuilder


@CommunityBuilder.app.route('/edit/<user_url_slug>/')
def show_edit(user_url_slug):
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))
    
    connection = CommunityBuilder.model.get_db()
    # Query database
    fetch_user = connection.execute(
        "SELECT * "
        "FROM users "
        "WHERE username = ?",
        [user_url_slug]
    ).fetchone()

    context = {"username":  flask.session['username'],
               "fullname": fetch_user['fullname'], 
               "email": fetch_user['email'],
               "age": fetch_user['age'],
               "about_me": fetch_user['about_me'],}

    #CommunityBuilder.model.close_db(True)
    return flask.render_template("edit.html", **context)

@CommunityBuilder.app.route('/edit/', methods=['POST'])
def update_profile():
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))
    
    username = flask.session['username']
    
    data = request.form
    # Access specific form fields by name
    email = data['email']
    about_me = data['about-me']
    
    connection = CommunityBuilder.model.get_db()
    # Query database
    connection.execute(
        "UPDATE users "
        "SET email = ?, about_me = ? "
        "WHERE username = ?",
        (email, about_me, username,)
    )
    
    CommunityBuilder.model.close_db(True)
    return flask.redirect(flask.url_for("show_user", user_url_slug=username))
    