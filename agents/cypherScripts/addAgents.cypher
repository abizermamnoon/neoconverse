WITH '{
	"MicrosoftGraph": {
		"key": "MicrosoftGraph",
		"title": "Talent Engines Bot",
		"icon": "/talent_engines_logo.jpg",
		"description": "The data includes attorney prfiles",
		"dataModelPath": "/talent_engines_logo.jpg",
		"databaseInfo": {
			"databaseName": "",
			"hostUrl": "neo4j+s://80a5f8b8.databases.neo4j.io",
			"username": "neo4j",
			"password": "N9Jhybir-NaFEsvGXS53X7SthV5wheHDEg7ua7yY-3E"
		},
		"order": 1,
		"isActive": true
	},
	"PatientJourney": {
		"key": "PatientJourney",
		"title": "Patient Journey",
		"icon": "/medicalchat.png",
		"description": "Synthetic dataset of 1.2M patient journeys including procedures, prescriptions, conditions",
		"dataModelPath": "/patientjourney_model.png",
		"databaseInfo": {
			"databaseName": "<your database name>",
			"hostUrl": "<your database host URL>",
			"username": "<database username>",
			"password": "<database password>"
		},
		"order": 2,
		"isActive": true
	}
}' as json

WITH apoc.convert.fromJsonMap(json) AS info
UNWIND keys(info) as key
WITH key, info[key] as info
MERGE (agent:NeoAgent {agent_name: key})
SET agent += {
	title: info.title,
	icon: info.icon,
	description: info.description,
	dataModelPath: info.dataModelPath,
	order: info.order,
	isActive: info.isActive
}
MERGE (db:DBConnection {name: key})
SET db += info.databaseInfo
MERGE (db)-[:DB_HAS_AGENT]->(agent)


