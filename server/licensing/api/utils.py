from functools import wraps
from contextlib import contextmanager
from threading import Lock


def clear_list(arr):
	return list(filter(lambda x: bool(x), arr))


def normalize(rows):
	zipped = zip(*rows)
	zipped_filtered = map(clear_list, zipped)
	zipped_filtered_list = list(zipped_filtered)
	normalized = map(lambda x: list(set(x)), zipped_filtered_list)
	return list(normalized)


def process_result_function(f):
	return f


def process_result_class(f):
	return f()


class with_lock():
	def lock_by(self, **kwargs):
		return kwargs

	def __call__(self, func):
		process_result = process_result_function
		if type(func) == type:
			process_result = process_result_class

		@wraps(func)
		def wrapped(request):
			lock_key = self.lock_by(request)
			Locker.lock(lock_key)
			try:
				result = process_result(func(request))
			finally:
				Locker.unlock(lock_key)

			return result
		return wrapped


class with_lock_by_userid(with_lock):
	def lock_by(self, request):
		return request.authenticated_userid


class with_lock_by():
	def lock_by(self, request):
		return request

	def __call__(self, func):
		process_result = process_result_function
		if type(func) == type:
			process_result = process_result_class

		@wraps(func)
		def wrapped(**kwargs):
			lock_key = self.lock_by(**kwargs)
			Locker.lock(lock_key)
			try:
				result = process_result(func(**kwargs))
			finally:
				Locker.unlock(lock_key)

			return result
		return wrapped


class with_lock_by_product_hardware(with_lock_by):
	def lock_by(self, **kwargs):
		return "{hardware_hid}:{product_guid}".format(**kwargs)


class MultiLock(object):
	def __init__(self):
		super(MultiLock, self).__init__()
		self.lock = Lock()
		self.count = 0

	def acquire(self):
		self.count += 1
		self.lock.acquire()

	def release(self):
		self.count -= 1
		self.lock.release()

	def as_dict(self):
		return {
			"count": self.count,
			"lock": str(self.lock),
		}


class Locker(object):
	locks = {}

	def lock(cls, key):
		if not cls.locks.get(key):
			cls.locks[key] = MultiLock()
		cls.locks[key].acquire()

	def unlock(cls, key):
		lock = cls.locks[key]
		lock.release()
		if lock.count == 0:
			del cls.locks[key]

	@contextmanager
	def by(Locker, key):
		try:
			Locker.lock(key)
			yield True
		finally:
			Locker.unlock(key)
