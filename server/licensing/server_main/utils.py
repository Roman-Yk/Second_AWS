import time


class measurer(object):
	measures = {}

	@classmethod
	def start(cls, key):
		cls.measures[key] = time.time()
		print(" >> Start ({}): {}".format(key, cls.measures[key]))

	@classmethod
	def stop(cls, key):
		end = time.time()
		length = end - cls.measures[key]
		print(" >> Stop ({}): {}".format(key, end))
		print(" >> Length ({}): {}".format(key, length))
