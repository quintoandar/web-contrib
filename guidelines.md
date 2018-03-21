# Guidelines

Hey there, I am a set of guidelines, make sure to consider me.

## XHR Using redux-pack.

Redux applications come with a intrinsic problem, which is asynchronicity (impure functions, side effects).
In order to deal with this issue, you may chooose to implement a rather verbose and tedious set of actions,
say one per request lifecycle.

e.g.
- `dispatching a *requestStarted* action when calling a browser fetch()`
- `dispatching another *requestSucceeded* action when it gets resolved`
- `OR possibly dispatching a *requestFailed* action if it gets rejected`

All of that comes with its corresponding *react-redux* boilerplate, i.e. actionCreators, unittests, maybe a thunk...
Therefore you might come to the conclusion that it would be better to use some lib to encapsulate that, I the guideline, 
would agree with you, person.

In a happy scenario where you did your job right, most of this async actions would be simple XHR