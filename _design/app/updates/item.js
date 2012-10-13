function(doc, req) {
    if ("DELETE" == req.method) {
        doc._deleted = true;
        return [
            doc,
            {
                "headers": {
                    "Content-Type": "application/hal+json",
                    "Vary": "Accept"
                },
                "body": JSON.stringify({"ok": true}) + "\n"
            }
        ];
    }
    switch (req.headers["Content-Type"]) {
        case "application/hal+json":
            if (doc) {
                updatedDoc = doc;
            } else {
                var updatedDoc = {};                
            }
            updatedDoc.resource = JSON.parse(req.body);
            if (!updatedDoc._id) {
                if (req.id) {
                    updatedDoc._id = req.id;
                } else if (req.uuid) {
                    updatedDoc._id = req.uuid;
                }
            }
            if (req.query.collection) {
                updatedDoc.collection = req.query.collection;
            }
            if (!updatedDoc.resource._links) {
                updatedDoc.resource._links = {};
            }
            updatedDoc.resource._links.self = { "href": "/api/" + updatedDoc._id };
            updatedDoc.resource._links.edit = { "href": "/api/" + updatedDoc._id + "/edit" };
            if (updatedDoc.collection) {
                updatedDoc.resource._links.collection = { "href": "/api/" + updatedDoc.collection };
            } else {
                updatedDoc.resource._links.up = { "href": "/api/" };
            }
            return [
                updatedDoc,
                {
                    "headers": {
                        "Location": updatedDoc.resource._links.self.href,
                        "Content-Type": "application/hal+json",
                        "Vary": "Accept"
                    },
                    "body": JSON.stringify(updatedDoc.resource) + "\n"
                }
            ];
        default:
            return [
                null,
                {
                    "code": 415,
                    "headers": {
                        "Content-Type": "text/plain;charset=utf-8",
                        "Vary": "Accept"
                    },
                    "body": JSON.stringify({"error":"unsupported_media_type","reason":"The media type sent is not supported."}) + "\n"
                }
            ];
    }
}
