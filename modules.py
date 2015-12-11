#!/usr/bin/env python3
import argparse, json, shlex, subprocess, os.path, sys

DEFAULT_MINIFIER = 'uglifyjs -m -c --'

# Modules should be added here
# shortName: [list of files]
MODULES = {
	'FW': ['external/zotero-transfw/framework.js']
}


argParser = argparse.ArgumentParser(description='list/update modules')
argParser.add_argument('-u', '--update', help='update modules', dest='update', action='store_true')
argParser.add_argument('-m', '--minifier',
	help='minifier command to use (must take list of files as terminal arguments). Default: ' + DEFAULT_MINIFIER,
	dest='minifier', default=DEFAULT_MINIFIER)
args = argParser.parse_args()


# Load existing modules
COMPILED_MODULES_PATH = 'src/resource/modules.json'
compiledModules = {}
try:
	with open(COMPILED_MODULES_PATH) as modulesFile:
		compiledModules = json.load(modulesFile)
except:
	pass

if not(isinstance(compiledModules, dict)):
	compiledModules = {}


# If we're not updating then we should list the modules
if not(args.update):
	empty = True
	for shortName, module in compiledModules.items():
		empty = False
		print("{} (v{} @{}) {}".format(shortName, module['version'], module['commit'], module['name']))
	
	if empty:
		print("No compiled modules available")
	
	sys.exit()


# Let's update modules if they are not at the current commit
changed = False
for shortName, files in MODULES.items():
	p = subprocess.Popen(shlex.split('git rev-parse --short HEAD'), cwd=os.path.dirname(files[0]), stdout=subprocess.PIPE, universal_newlines=True)
	commit = p.stdout.readline()[:-1]
	
	if shortName in compiledModules and commit == compiledModules[shortName]['commit']:
		print('{} is already at {}. Skipping'.format(shortName, commit))
		continue
	
	changed = True
	
	if not(shortName in compiledModules):
		print('Creating new module {} v1 at commit {}. Remember to specify a friendly name!'.format(shortName, commit))
		compiledModules[shortName] = {
			'name': shortName,
			'version': 1,
			'commit': commit
		}
	else:
		module = compiledModules[shortName]
		print('{} v{} was at {}, changing to {}'.format(shortName, module['version'], module['commit'], commit))
		module['version'] += 1
		module['commit'] = commit
	
	# Minify code
	p = subprocess.Popen(shlex.split(args.minifier) + files, stdout=subprocess.PIPE, universal_newlines=True)
	compiledModules[shortName]['code'] = p.stdout.readline()[:-1]

# Write JSON to file
with open(COMPILED_MODULES_PATH, 'w') as file:
	json.dump(compiledModules, file, indent='\t', sort_keys=True)

