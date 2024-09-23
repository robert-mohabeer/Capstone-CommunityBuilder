"""REST API for creating and deleting comments for events."""
import flask
import CommunityBuilder


@CommunityBuilder.app.route('/api/v1/userinfo')
def userinfo():
    if 'username' not in flask.session:
        
        flask.abort(400)
        
    return flask.make_response(flask.jsonify(username=flask.session['username']))

@CommunityBuilder.app.route('/api/v1/comments/', methods=['POST'])
def create_comment():
    """Make POST request to create comment on photo with eventid=?.

    201 on success and 200 if rsvp already eixsts.
    Example:
    {
        "commentid": 8,
        "lognameOwnsThis": true,
        "owner": "awdeorio",
        "ownerShowUrl": "/users/awdeorio/",
        "text": "Comment sent from httpie",
        "url": "/api/v1/comments/8/"
    }
    """
    if 'username' not in flask.session:
        flask.abort(400)

    username = flask.session['username']

    if flask.request.args.get('eventid', type=int) is None or \
            flask.request.json.get('text') is None or \
            not flask.request.json['text']:
        flask.abort(400)

    connection = CommunityBuilder.model.get_db()
    if connection.execute(
        "SELECT eventid FROM events "
        "WHERE eventid = ?",
            [flask.request.args['eventid']]).fetchone() is None:
        flask.abort(400)

    connection.execute(
        "INSERT INTO comments(owner, eventid, text) "
        "VALUES (?, ?, ?)",
        [username,
         flask.request.args['eventid'],
         flask.request.json['text']]
    )

    fetch_comment = connection.execute(
        "SELECT * FROM comments WHERE commentid = "
        "(SELECT last_insert_rowid() FROM comments)"
    ).fetchone()

    context = {
        "commentid": fetch_comment['commentid'],
        "lognameOwnsThis": (fetch_comment['owner'] == username),
        "owner": fetch_comment['owner'],
        "ownerShowUrl": f"/users/{fetch_comment['owner']}/",
        "text": fetch_comment['text'],
        "url": f"/api/v1/comments/{fetch_comment['commentid']}/"
    }

    CommunityBuilder.model.close_db(True)
    return flask.make_response(flask.jsonify(**context), 201)


@CommunityBuilder.app.route('/api/v1/comments/<int:comment_id>/', methods=['DELETE'])
def delete_comment(comment_id):
    """Handle DELETE request for comments with comment_id.

    204 on Success, 404 if comment_id does not exist & 403 if user
    does not own the comment.
    """
    if 'username' not in flask.session:
        flask.abort(400)

    username = flask.session['username']

    connection = CommunityBuilder.model.get_db()

    fetch_comment = connection.execute(
        "SELECT commentid, owner "
        "FROM comments "
        "WHERE commentid = ?",
        [comment_id]
    ).fetchone()

    if fetch_comment is None:
        flask.abort(403)

    if fetch_comment['owner'] != username:
        flask.abort(403)

    connection.execute(
        "DELETE FROM comments "
        "WHERE commentid = ?",
        [comment_id]
    )

    CommunityBuilder.model.close_db(True)
    return flask.make_response({}, 204)
