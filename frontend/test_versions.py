import json
import os

dirs = ["api", "application", "blocks", "forms", "shared"]

dd = {}

for d in dirs:
	package = json.load(open("{}/package.json".format(d), "r"))
	dep = package["dependencies"]
	dep_d = package["devDependencies"]
	al = {}
	al.update(dep)
	al.update(dep_d)

	for name, version in al.items():
		if not name in dd:
			dd[name] = set()
		dd[name].add(version)
		# print(name, version)

for k, v in dd.items():
	if len(v) > 1:
		print(k, v)
	# print(dd)
	# print(al)

