define({ "api": [
  {
    "type": "post",
    "url": "/api/activation/activate",
    "title": "Activite License",
    "name": "ActivationActivate",
    "description": "<p>License activation</p>",
    "group": "Activation",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "public_key",
            "description": "<p>License key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ip_address",
            "description": "<p>Client computer IP address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logged_username",
            "description": "<p>Client computer user name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "os_name",
            "description": "<p>Client computer operating system name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "activated",
            "description": "<p>Activation result.</p>"
          }
        ]
      }
    },
    "filename": "../server/licensing/api/activation/views.py",
    "groupTitle": "Activation"
  },
  {
    "type": "post",
    "url": "/api/activation/check",
    "title": "Check License",
    "name": "ActivationCheck",
    "description": "<p>License checking</p>",
    "group": "Activation",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "public_key",
            "description": "<p>License key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ip_address",
            "description": "<p>Client computer IP address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logged_username",
            "description": "<p>Client computer user name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "os_name",
            "description": "<p>Client computer operating system name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "is_active",
            "description": "<p>Check result.</p>"
          }
        ]
      }
    },
    "filename": "../server/licensing/api/activation/views.py",
    "groupTitle": "Activation"
  },
  {
    "type": "post",
    "url": "/api/activation/deactivate",
    "title": "Deactivate License",
    "name": "ActivationDeactivate",
    "description": "<p>License deactivation</p>",
    "group": "Activation",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "public_key",
            "description": "<p>License key.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "activated",
            "description": "<p>Deactivation result.</p>"
          }
        ]
      }
    },
    "filename": "../server/licensing/api/activation/views.py",
    "groupTitle": "Activation"
  },
  {
    "type": "post",
    "url": "/api/activation/reactivate",
    "title": "Reactivate License",
    "name": "ActivationReactivate",
    "description": "<p>License reactivation</p>",
    "group": "Activation",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "public_key",
            "description": "<p>License key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ip_address",
            "description": "<p>Client computer IP address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logged_username",
            "description": "<p>Client computer user name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "os_name",
            "description": "<p>Client computer operating system name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "is_active",
            "description": "<p>Reactivation result.</p>"
          }
        ]
      }
    },
    "filename": "../server/licensing/api/activation/views.py",
    "groupTitle": "Activation"
  },
  {
    "type": "post",
    "url": "/api/activity/tracker",
    "title": "Activity Tracker",
    "name": "Activity_Tracker",
    "description": "<p>Activity Tracker</p>",
    "group": "Activity_Tracker",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hardware_id",
            "description": "<p>User unique hardware ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_guid",
            "description": "<p>Product GUID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "public_key",
            "description": "<p>License key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ip_address",
            "description": "<p>Client computer IP address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logged_username",
            "description": "<p>Client computer user name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "os_name",
            "description": "<p>Client computer operating system name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "type",
            "description": "<p>Activity type</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "param_1",
            "description": "<p>Activity param 1</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "param_2",
            "description": "<p>Activity param 2</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Response",
            "description": "<p>code</p>"
          }
        ]
      }
    },
    "filename": "../server/licensing/api/tracking/views.py",
    "groupTitle": "Activity_Tracker"
  }
] });
