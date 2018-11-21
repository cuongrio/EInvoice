# E-INVOICE



### DEPLOYMENT CONFIG
"engines": {
    "node": "10.3.0"
},
"scripts": {
	"ng": "ng",
	"build": "ng build --prod",
	"start": "http-server dist/",
	"serve:sw": "npm run build -s && npx http-server ./dist -p 4200",
	"lint": "ng lint && stylelint \"src/**/*.scss\" --syntax scss && htmlhint \"src\" --config .htmlhintrc",
	"test": "ng test",
	"test:ci": "npm run lint -s && ng test --code-coverage --watch=false",
	"e2e": "ng e2e",
	"translations:extract": "ngx-translate-extract --input ./src --output ./src/translations/template.json --format=json --clean -sort --marker extract",
	"docs": "hads ./docs -o",
	"env": "ngx-scripts env npm_package_version",
	"prettier": "prettier --write \"./{src,e2e}/**/*.{ts,js,scss}\"",
	"prettier:check": "prettier --list-different \"./{src,e2e}/**/*.{ts,js,scss}\"",
	"preinstall": "npm install -g http-server",
	"postinstall": "ng build --prod",
	"precommit": "pretty-quick --staged",
	"generate": "ng generate"
},

### DEV CONFIG
"scripts": {
	"start": "ng serve",
	"postinstall": "npm run prettier -s"
}