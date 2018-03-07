# Guidelines

Hey there, I am a set of guidelines, make sure to consider me.

## XHR Using redux-pack.

Redux applications come with a intrinsic problem, which is asynchronicity (impure functions, side effects).
In order to deal with this issue, you may implement a rather verbose tedious set of actions, say one per request lifecycle,

e.g.
- `dispatching a *requestStarted* action when calling a browser fetch()`
- `dispatching another *requestSucceeded* action when it gets resolved`
- ` OR possibly dispatching a *requestFailed* action if it gets rejected`

All of that comes with its corresponding *react-redux* boilerplate, i.e. actionCreators, unittests, maybe a thunk...