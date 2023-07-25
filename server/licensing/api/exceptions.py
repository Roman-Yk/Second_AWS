from pyramid import httpexceptions


class HTTPException(httpexceptions.HTTPException):
	pass


class HTTPConflict(HTTPException, httpexceptions.HTTPConflict):
	pass


class HTTPBadRequest(HTTPException, httpexceptions.HTTPBadRequest):
	pass


class HTTPNotFound(HTTPException, httpexceptions.HTTPNotFound):
	pass
