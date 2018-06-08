// const expect = chai.expect;
// var sandbox = sinon.sandbox.create();


describe("Form Builder Test Suite", function() {

	var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;	//1 minute
    });

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		// Each spec (test) renders its components into the same div,
		// so we need to clear that div out at the end of each spec.
		$T.clearRenderedTestComponents();
		//sandbox.restore();
	});
/*
  describe('S360_FA:S360_B_Base_InputText', function() {
    // We encourage you to have the code for c:egRenderElement side by side
    // when reading through this spec.
    it('renders specific static text', function(done) {
      debugger;
      $T.createComponent("S360_FA:S360_B_Base_InputText", {}, true)
        // The 'component' here is the instance of c:egRenderElement
        .then(function(component) {
          component.set('v.IsDisabled', true);
          component.set('v.Value', 'a');
          var test = component.get('v.Value');
          expect(component.get('v.Value')).toBe("");
          done();
        }).catch(function(e) {
          // end this spec as a failure

        });
    });
  });

  describe('S360_FA:S360_FormBuilderStandard', function() {
    // We encourage you to have the code for c:egRenderElement side by side
    // when reading through this spec.
    it('Loading Data and Form Config Test', function(done) {
      debugger;
      $T.createComponent("S360_FA:S360_FormBuilderStandard", {

        }, true)
        // The 'component' here is the instance of c:egRenderElement
        .then(function(component) {
          debugger;
          component.setup(
            {
              "S360_FA__SelectedVersion__c": 0,
              "S360_FA__Primary_Object__c": "Account",
              "S360_FA__Field__c": "Name",
              // "AccountNumber":,
              // "Description":,
              // "Phone":,
              // "LastActivityDate":,
              // "Website":,
              "S360_FA__Component_Type__c": "Standard",
              "Id": "a040a00000bhR6uAAE",
              "S360_FA__JSON__c": {
                "components": [{
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "inputType": "text",
                  "inputMask": "",
                  "label": "Name",
                  "key": "Name",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "multiple": false,
                  "defaultValue": "",
                  "protected": false,
                  "unique": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "spellcheck": true,
                  "validate": {
                    "required": true,
                    "minLength": "",
                    "maxLength": "",
                    "pattern": "",
                    "custom": "",
                    "customPrivate": false
                  },
                  "conditional": {
                    "show": null,
                    "when": null,
                    "eq": ""
                  },
                  "type": "textfield",
                  "$$hashKey": "object:208",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState", "ShippingPostalCode",
                   "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating", "Site", "OwnerId",
                    "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId",
                     "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "lockKey": true
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "inputType": "text",
                  "inputMask": "",
                  "label": "Text",
                  "key": "undefinedText",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "multiple": false,
                  "defaultValue": "",
                  "protected": false,
                  "unique": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "spellcheck": true,
                  "validate": {
                    "required": true,
                    "minLength": "",
                    "maxLength": "",
                    "pattern": "",
                    "custom": "",
                    "customPrivate": false
                  },
                  "conditional": {
                    "show": null,
                    "when": null,
                    "eq": ""
                  },
                  "type": "textfield",
                  "$$hashKey": "object:305",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState",
                   "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating",
                    "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted",
                     "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"]
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "inputType": "number",
                  "label": "Account Number",
                  "key": "AccountNumber",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "defaultValue": "",
                  "protected": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "validate": {
                    "required": false,
                    "min": "",
                    "max": "",
                    "step": "any",
                    "integer": "",
                    "multiple": "",
                    "custom": ""
                  },
                  "type": "number",
                  "$$hashKey": "object:267",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState",
                   "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating",
                    "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted",
                     "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "tags": [],
                  "properties": {},
                  "lockKey": true
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": false,
                  "inputType": "password",
                  "label": "Password",
                  "key": "Description",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "protected": true,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "type": "password",
                  "$$hashKey": "object:346",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState",
                   "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description",
                    "Rating", "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc",
                     "YearStarted", "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "tags": [],
                  "properties": {},
                  "lockKey": true,
                  "validate": {
                    "required": false
                  }
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "label": "Select",
                  "key": "undefinedSelect",
                  "placeholder": "",
                  "data": {
                    "values": [{
                      "value": "1",
                      "label": "1",
                      "$$hashKey": "object:475"
                    }, {
                      "value": "2",
                      "label": "2",
                      "$$hashKey": "object:480"
                    }, {
                      "value": "3",
                      "label": "3",
                      "$$hashKey": "object:484"
                    }],
                    "json": "",
                    "url": "",
                    "resource": "",
                    "custom": ""
                  },
                  "dataSrc": "values",
                  "valueProperty": "",
                  "defaultValue": "",
                  "refreshOn": "",
                  "filter": "",
                  "authenticate": false,
                  "template": "<span>{{ item.label }}</span>",
                  "multiple": false,
                  "protected": false,
                  "unique": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "validate": {
                    "required": false
                  },
                  "type": "select",
                  "$$hashKey": "object:409",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState", "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating", "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "tags": [],
                  "properties": {}
                }, {
                  "inputMask": "",
                  "input": true,
                  "type": "phoneNumber",
                  "key": "Phone",
                  "$$hashKey": "object:494",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState",
                   "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating", "Site",
                   "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId",
                    "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "lockKey": true,
                  "label": "Phone Number"
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "label": "Date Time",
                  "key": "LastActivityDate",
                  "placeholder": "",
                  "format": "yyyy-MM-dd hh:mm a",
                  "enableDate": true,
                  "enableTime": true,
                  "defaultDate": "",
                  "datepickerMode": "day",
                  "datePicker": {
                    "showWeeks": true,
                    "startingDay": 0,
                    "initDate": "",
                    "minMode": "day",
                    "maxMode": "year",
                    "yearRows": 4,
                    "yearColumns": 5,
                    "minDate": null,
                    "maxDate": null,
                    "datepickerMode": "day"
                  },
                  "timePicker": {
                    "hourStep": 1,
                    "minuteStep": 1,
                    "showMeridian": true,
                    "readonlyInput": false,
                    "mousewheel": true,
                    "arrowkeys": true
                  },
                  "protected": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "validate": {
                    "required": false,
                    "custom": ""
                  },
                  "type": "datetime",
                  "$$hashKey": "object:556",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude",
                   "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState", "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue",
                    "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating", "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource",
                     "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "tags": [],
                  "properties": {},
                  "lockKey": true
                }, {
                  "autofocus": false,
                  "input": true,
                  "tableView": true,
                  "inputType": "email",
                  "label": "Email",
                  "key": "Website",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "defaultValue": "",
                  "protected": false,
                  "unique": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "kickbox": {
                    "enabled": false
                  },
                  "type": "email",
                  "$$hashKey": "object:675",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity",
                  "ShippingState", "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol",
                  "Description", "Rating", "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode",
                  "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "lockKey": true
                }, {
                  "input": true,
                  "tableView": true,
                  "label": "Signature",
                  "key": "undefinedSignature",
                  "placeholder": "",
                  "footer": "Sign above",
                  "width": "100%",
                  "height": "150px",
                  "penColor": "black",
                  "backgroundColor": "rgb(245,245,235)",
                  "minWidth": "0.5",
                  "maxWidth": "2.5",
                  "protected": false,
                  "persistent": true,
                  "hidden": false,
                  "clearOnHide": true,
                  "validate": {
                    "required": false
                  },
                  "type": "signature",
                  "$$hashKey": "object:628",
                  "hideLabel": true,
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity", "ShippingState",
                   "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership", "TickerSymbol", "Description", "Rating",
                    "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource", "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted",
                     "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"],
                  "lockKey": true
                }, {
                  "errorMessage": "",
                  "successMessage": "",
                  "label": "Button",
                  "actions": [{
                    "name": "standard",
                    "title": "Standard",
                    "$$hashKey": "object:284"
                  }, {
                    "name": "custom",
                    "title": "Custom",
                    "$$hashKey": "object:285"
                  }],
                  "standardActions": [{
                    "name": "show",
                    "title": "Show",
                    "$$hashKey": "object:287"
                  }, {
                    "name": "hide",
                    "title": "Hide",
                    "$$hashKey": "object:288"
                  }, {
                    "name": "toggleShowHide",
                    "title": "Toggle Show Hide",
                    "$$hashKey": "object:289"
                  }, {
                    "name": "next",
                    "title": "Next",
                    "$$hashKey": "object:290"
                  }, {
                    "name": "previous",
                    "title": "Previous",
                    "$$hashKey": "object:291"
                  }, {
                    "name": "redirect",
                    "title": "Redirect",
                    "$$hashKey": "object:292"
                  }, {
                    "name": "submit",
                    "title": "Submit",
                    "$$hashKey": "object:293"
                  }],
                  "submitSuccess": false,
                  "submitFailed": false,
                  "submitRedirect": false,
                  "action": "standard",
                  "event": "submit",
                  "target": "",
                  "redirectUri": "",
                  "redirectTarget": "",
                  "submitSuccessCallback": "",
                  "submitFailedCallback": "",
                  "type": "button",
                  "$$hashKey": "object:14",
                  "key": "button",
                  "apis": ["Id", "IsDeleted", "MasterRecordId", "Name", "Type", "ParentId", "BillingStreet", "BillingCity", "BillingState", "BillingPostalCode", "BillingCountry", "BillingLatitude", "BillingLongitude", "BillingGeocodeAccuracy", "BillingAddress", "ShippingStreet", "ShippingCity",
                   "ShippingState", "ShippingPostalCode", "ShippingCountry", "ShippingLatitude", "ShippingLongitude", "ShippingGeocodeAccuracy", "ShippingAddress", "Phone", "Fax", "AccountNumber", "Website", "PhotoUrl", "Sic", "Industry", "AnnualRevenue", "NumberOfEmployees", "Ownership",
                    "TickerSymbol", "Description", "Rating", "Site", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById", "SystemModstamp", "LastActivityDate", "LastViewedDate", "LastReferencedDate", "Jigsaw", "JigsawCompanyId", "CleanStatus", "AccountSource",
                    "DunsNumber", "Tradestyle", "NaicsCode", "NaicsDesc", "YearStarted", "SicDesc", "DandbCompanyId", "S360_FA__CustomerPriority__c", "S360_FA__SLA__c", "S360_FA__Active__c", "S360_FA__NumberofLocations__c", "S360_FA__UpsellOpportunity__c", "S360_FA__SLASerialNumber__c", "S360_FA__SLAExpirationDate__c"]
                }],
                "display": "form",
                "page": 0
              }
            },
            {
              "sobjectType": "Account",
              "Id": "0010a00001POTnmAAH",
              "Name": "Craig Lewis",
              "AccountNumber": "",
              "Description": "asdfklsadf",
              "Phone": "1112223334",
              "LastActivityDate": "",
              "Website": "test@example.com",
            },
            {
              "Id": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Account ID"
              },
              "IsDeleted": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Deleted"
              },
              "MasterRecordId": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Master Record ID",
                "relationshipApi": "MasterRecord"
              },
              "Name": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Name"
              },
              "Type": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Type"
              },
              "ParentId": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Parent Account ID",
                "relationshipApi": "Parent"
              },
              "BillingStreet": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Street"
              },
              "BillingCity": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing City"
              },
              "BillingState": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing State/Province"
              },
              "BillingPostalCode": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Zip/Postal Code"
              },
              "BillingCountry": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Country"
              },
              "BillingLatitude": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Latitude"
              },
              "BillingLongitude": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Longitude"
              },
              "BillingGeocodeAccuracy": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Billing Geocode Accuracy"
              },
              "BillingAddress": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Billing Address"
              },
              "ShippingStreet": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Street"
              },
              "ShippingCity": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping City"
              },
              "ShippingState": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping State/Province"
              },
              "ShippingPostalCode": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Zip/Postal Code"
              },
              "ShippingCountry": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Country"
              },
              "ShippingLatitude": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Latitude"
              },
              "ShippingLongitude": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Longitude"
              },
              "ShippingGeocodeAccuracy": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Shipping Geocode Accuracy"
              },
              "ShippingAddress": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Shipping Address"
              },
              "Phone": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Phone"
              },
              "Fax": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Fax"
              },
              "AccountNumber": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Number"
              },
              "Website": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Website"
              },
              "PhotoUrl": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Photo URL"
              },
              "Sic": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "SIC Code"
              },
              "Industry": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Industry"
              },
              "AnnualRevenue": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Annual Revenue"
              },
              "NumberOfEmployees": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Employees"
              },
              "Ownership": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Ownership"
              },
              "TickerSymbol": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Ticker Symbol"
              },
              "Description": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Description"
              },
              "Rating": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Rating"
              },
              "Site": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Site"
              },
              "OwnerId": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Owner ID",
                "relationshipApi": "Owner"
              },
              "CreatedDate": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Created Date"
              },
              "CreatedById": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Created By ID",
                "relationshipApi": "CreatedBy"
              },
              "LastModifiedDate": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Last Modified Date"
              },
              "LastModifiedById": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Last Modified By ID",
                "relationshipApi": "LastModifiedBy"
              },
              "SystemModstamp": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "System Modstamp"
              },
              "LastActivityDate": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Last Activity"
              },
              "LastViewedDate": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Last Viewed Date"
              },
              "LastReferencedDate": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Last Referenced Date"
              },
              "Jigsaw": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Data.com Key"
              },
              "JigsawCompanyId": {
                "isAccessible": true,
                "isCreateable": false,
                "isUnique": false,
                "isUpdateable": false,
                "label": "Jigsaw Company ID",
                "relationshipApi": "JigsawCompany"
              },
              "CleanStatus": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Clean Status"
              },
              "AccountSource": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Account Source"
              },
              "DunsNumber": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "D-U-N-S Number"
              },
              "Tradestyle": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Tradestyle"
              },
              "NaicsCode": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "NAICS Code"
              },
              "NaicsDesc": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "NAICS Description"
              },
              "YearStarted": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Year Started"
              },
              "SicDesc": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "SIC Description"
              },
              "DandbCompanyId": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "D&B Company ID",
                "relationshipApi": "DandbCompany"
              },
              "S360_FA__CustomerPriority__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Customer Priority"
              },
              "S360_FA__SLA__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "SLA"
              },
              "S360_FA__Active__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Active"
              },
              "S360_FA__NumberofLocations__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Number of Locations"
              },
              "S360_FA__UpsellOpportunity__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "Upsell Opportunity"
              },
              "S360_FA__SLASerialNumber__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "SLA Serial Number"
              },
              "S360_FA__SLAExpirationDate__c": {
                "isAccessible": true,
                "isCreateable": true,
                "isUnique": false,
                "isUpdateable": true,
                "label": "SLA Expiration Date"
              }
            },
            {
              "isAccessible": true,
              "isUpdateable": true,
              "isCreateable": true,
              "isDeletable": true,
            });
          expect(component.get('v.FormConfig').S360_FA__SelectedVersion__c).toBe(0);
          expect(component.get('v.Data').Name).toBe('Craig Lewis');
          expect(component.get('v.FieldInfo').Id.label).toBe('Account ID');
          expect(component.get('v.ObjectInfo').isAccessible).toBe(true);
          expect(component.get('v.FormConfig').Id).toBe("a040a00000bhR6uAAE");
          //expect(component.get('v.componentData').Name).toBe('Craig Lewis')
            console.log("FieldInfo Tests:");
            var pattern = component.get('v.componentData');
            // for (var i in pattern) {
            //   console.log(i + ":" + pattern[i]);
            //   for (var j in pattern[i]) {
            //     console.log(j + pattern[i][j]);
            //   }
            // }
          done();

        }).catch(function(e) {
          // end this spec as a failure
          done.fail(e);
        });
    });
  });

  describe('S360_FA:S360_FormBuilderMain', function() {
    it('Retrieve FormConfig Test', function(done) {
      $T.createComponent("S360_FA:S360_FormBuilderMain", {
          "formConfigName": "LTSForm",
          "recordId": "0010a00001POTnmAAH"
        }, true)
        .then(function(component) {
			return $T.waitFor(function(){
				if(component.get("v.componentType")){
					return component;
				}
			});
        }).then(function(component) {
			expect(component.get('v.Data').Name).toBe('Craig Lewis');
			expect(component.get('v.FieldInfo').Name.isAccessible).toBe(true);
			expect(component.get('v.ObjectInfo').isAccessible).toBe(true);
			expect(component.get('v.FormConfig').S360_FA__Primary_Object__c).toBe('Account');
			expect(component.get('v.FormConfig').S360_FA__Component_Type__c).toBe('Standard');
			done();
        }).catch(function(e) {
          // end this spec as a failure
          done.fail(e);
        });
    });

	it('Handle standard button clicked and upsert', function(done) {
      $T.createComponent("S360_FA:S360_FormBuilderMain", {
          "formConfigName": "LTSForm",
          "recordId": "0010a00001POTnmAAH"
        }, true)
		.then(function(component) {
			return $T.waitFor(function(){
				if(component.get("v.componentType")){
					return component;
				}
			});
        }).then(function(component) {
			var data = component.get('v.Data');
			var oriNumberOfEmployees = data.NumberOfEmployees || 0;
			var numberOfEmployees = data.NumberOfEmployees || 0;

			numberOfEmployees++;
			data.NumberOfEmployees = numberOfEmployees;

			component.set('v.Data', data);

			return $T.waitFor(function(){
				if(component.find('S360_FormBuilderStandard').find('button') != undefined){
					return component;
				}
			}, 300000); // 5 minutes
        }).then(function(component) {
			var oldToast = component.find('S360_FormBuilderStandard').get('v.showToast');
			component.find('S360_FormBuilderStandard').find('button').getElement().click();
			return $T.waitFor(function(){
				if(component.find('S360_FormBuilderStandard').get('v.showToast') != oldToast){
					//expect(component.find('S360_FormBuilderStandard').get('v.TextMessage')).toBe($A.get("$Label.c.S360_base_default_success_message"));
					var S360_FormBuilderStandard = component.find('S360_FormBuilderStandard');
					console.log(JSON.stringify(S360_FormBuilderStandard.get('v.componentData')));
					expect(S360_FormBuilderStandard.get('v.ToastType')).toBe("error");
					done();
				}
			}, 30000); // 30 seconds
        }).catch(function(e) {
          // end this spec as a failure
          done.fail(e);
        });
    });
  });

  describe("S360_B_Base_Button", function() {
    it('Button Initialization', function(done) {
      debugger;
      $T.createComponent("S360_FA:S360_B_Base_Button", {
          "CompId" : 2341234,
          "payload": {},
          "ButtonLabel": "Test",
          "IsHidden": false,
          "IsDisabled": false,
          "faClass": "neutral"
        }, true)
        // The 'component' here is the instance of c:egRenderElement
        .then(function(component) {
          expect(component.get("v.CompId")).toBe(2341234);
          expect(component.get("v.payload")).toEqual({});
          expect(component.get("v.ButtonLabel")).toBe("Test");
          expect(component.get("v.IsHidden")).toBe(false);
          expect(component.get("v.IsDisabled")).toBe(false);
          expect(component.get("v.faClass")).toBe("neutral");
          done();
        }).catch(function(e) {
          done.fail(e);
        });
      });
  });

  describe("S360_B_Base_Captcha", function() {
    it('Captcha Initialization', function(done) {
      debugger;
      $T.createComponent("S360_FA:S360_B_Base_Captcha", {
          "CompId" : 2341234,
          "Lang" : "English",
          "SiteKey": "3124jh12l34k"
        }, true)
        // The 'component' here is the instance of c:egRenderElement
        .then(function(component) {
          expect(component.get("v.CompId")).toBe(2341234);
          //expect(component.get("v.payload")).toBe({});
          expect(component.get("v.Lang")).toBe("English");
          expect(component.get("v.SiteKey")).toBe("3124jh12l34k");
          done();
        }).catch(function(e) {
          done.fail(e);
        });
      });
  });

  describe("PicklistCmp", function() {
    it('Picklist Initialization', function(done) {
      debugger;
      $T.createComponent("S360_FA:PicklistCmp", {
          "CompId" : 2341234,
          "DefaultK" : "English",
          "PicklistKV": "1,2,3"
        }, true)
        // The 'component' here is the instance of c:egRenderElement
        .then(function(component) {
          expect(component.get("v.CompId")).toBe(2341234);
          //expect(component.get("v.payload")).toBe({});
          expect(component.get("v.DefaultK")).toBe("English");
          expect(component.find("InputSelectId")
          .get("v.options"))
          .toEqual([{ class: 'optionClass', label: '1', value: '1', selected: true },
           { class: 'optionClass', label: '2', value: '2' },
            { class: 'optionClass', label: '3', value: '3' }]);
          done();
        }).catch(function(e) {
          done.fail(e);
        });
      });
  });

  describe("S360_B_Base_Card", function() {
    it('Base Card Init Test', function(done) {
      //Dynamically creating component
      $T.createComponent("S360_FA:S360_B_Base_Card",
       {
         "Title" : "Test",
         "Class" : "Class1"
       }, true)
        .then(function(component) {
          //Verifying attributes against expected value
            expect(component.get("v.Title")).toBe("Test");
            expect(component.get("v.Class")).toBe("Class1");
            done(); //Done Call to signify end of test
        }).catch(function(e) {
          //If the function has an error or an expect fails the catch box fires
          done.fail(e);
        });
      });
  });*/

	describe("S360_B_Base_DatePicklist", function() {
    it('Picklist Init', function(done) {
      //Dynamically creating component
      $T.createComponent("S360_FA:S360_B_Base_DatePicklist",
       {
				 "DefaultMonth": "January",
				 "DefaultDay": "30",
				 "DefaultYear": "2018"

       }, true)
        .then(function(component) {
          //Verifying attributes against expected value
					debugger;
            expect(component.get("v.DefaultMonth")).toBe("January");
            expect(component.get("v.DefaultYear")).toBe("2018");
						//expect(component.find('InputDay').get("v.options")).toEqual("");
						component.find("InputMonth").set("v.option.value", "February");
						console.log(component.find("InputMonth").get("v.value"));
						//expect(component.find('InputDay').get("v.options")).toEqual("");

						expect(component.get("v.DefaultMonth")).toBe("January");
						component.set("v.IsDisabled", true);
            expect(component.get("v.DefaultYear")).toBe("");
						expect(component.get('v.PicklistDay')).toEqual([]);
            done(); //Done Call to signify end of test
        }).catch(function(e) {
          //If the function has an error or an expect fails the catch box fires
          done.fail(e);
        });
      });
  });

	describe("S360_B_Base_InputEmail", function() {
    it('Input Email Init Test', function(done) {
      //Dynamically creating component
      $T.createComponent("S360_FA:S360_B_Base_InputEmail", {}, true)
        .then(function(component) {
          //Verifying attributes against expected value
            expect(component.get("v.IsMissingValueLocal")).toBe(true);
            done(); //Done Call to signify end of test
        }).catch(function(e) {
          //If the function has an error or an expect fails the catch box fires
          done.fail(e);
        });
      });
  });

	// describe("S360_B_Base_InputPhone", function() {
  //   it('Input Phone Basic Test', function(done) {
  //     //Dynamically creating component
  //     $T.createComponent("S360_FA:S360_B_Base_InputPhone",
	// 		{
	// 		}, true)
  //       .then(function(component) {
  //         //Verifying attributes against expected value
	// 				component.find("inputPhone").select();//.set("v.Value", "February");
  //           expect(component.get("v.IsMissingValueLocal")).toBe(true);
	// 					expect(component.find("inputPhone").get("v.errors")).toBe("");
  //           done(); //Done Call to signify end of test
  //       }).catch(function(e) {
  //         //If the function has an error or an expect fails the catch box fires
  //         done.fail(e);
  //       });
  //     });
  // });

	// describe("S360_B_Base_PanelCmp", function() {
  //   it('Panel Init Test', function(done) {
  //     //Dynamically creating component
  //     $T.createComponent("S360_FA:S360_B_Base_PanelCmp",
	// 		 {
	// 			 "displayPosition": 1,
	// 			 "isReady":  true,
	// 			 "Title" : "test",
	// 			 "body" : {"length": 10}
	// 		 }, true)
  //       .then(function(component) {
  //         //Verifying attributes against expected value
	// 				debugger;
	// 				expect(component.get("v.Title")).toBe("test")
	// 				  expect(component.get("v.displayPosition")).toBe(0);
  //           component.next();
	// 					expect(component.get("v.displayPosition")).toBe(1);
	// 					component.previous();
	// 					expect(component.get("v.displayPosition")).toBe(0);
  //           done(); //Done Call to signify end of test
  //       }).catch(function(e) {
  //         //If the function has an error or an expect fails the catch box fires
  //         done.fail(e);
  //       });
  //     });
  // });
});
