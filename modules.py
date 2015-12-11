#!/usr/bin/env python3
import argparse, json, shlex, subprocess, os.path, sys

MINIFIER_VERSION_CMD = 'uglifyjs --version'
MINIFIER_PROCESS_CMD = 'uglifyjs -m -c --'

# Modules should be added here
# shortName: [list of files]
MODULES = {
	'FW': {
	    'files': ['external/zotero-transfw/framework.js'],
	    'url': 'https://github.com/egh/zotero-transfw/blob/master/framework.js'
	}
}


argParser = argparse.ArgumentParser(description='list/update modules')
argParser.add_argument('-u', '--update', help='update modules', dest='update', action='store_true')
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

p = subprocess.Popen(MINIFIER_VERSION_CMD, shell=True, stdout=subprocess.PIPE, universal_newlines=True)
minifierVersion = p.stdout.readline()[:-1]

# Let's update modules if they are not at the current commit
changed = False
for shortName, data in MODULES.items():
	p = subprocess.Popen(shlex.split('git rev-parse --short HEAD'), cwd=os.path.dirname(data['files'][0]), stdout=subprocess.PIPE, universal_newlines=True)
	commit = p.stdout.readline()[:-1]
	
	if shortName in compiledModules and commit == compiledModules[shortName]['commit']:
		print('{} is already at {}. Skipping'.format(shortName, commit))
		continue
	
	changed = True
	
	generator = "Generated with '{}' using {}".format(MINIFIER_PROCESS_CMD, minifierVersion)
	
	if not(shortName in compiledModules):
		print('Creating new module {} v1 at commit {}. Remember to specify a friendly name!'.format(shortName, commit))
		compiledModules[shortName] = {
			'name': shortName,
			'version': 1,
			'url': data['url'],
			'commit': commit,
			'generator': generator
		}
	else:
		module = compiledModules[shortName]
		print('{} v{} was at {}, changing to {}'.format(shortName, module['version'], module['commit'], commit))
		module['version'] += 1
		module['url'] = data['url']
		module['commit'] = commit
		module['generator'] = generator
	
	# Minify code
	p = subprocess.Popen(shlex.split(MINIFIER_PROCESS_CMD) + data['files'], stdout=subprocess.PIPE, universal_newlines=True)
	compiledModules[shortName]['code'] = p.stdout.readline()[:-1]

# Write JSON to file
with open(COMPILED_MODULES_PATH, 'w') as file:
	json.dump(compiledModules, file, indent='\t', sort_keys=True)

