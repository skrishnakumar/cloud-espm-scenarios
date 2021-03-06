jQuery.sap.declare("sap.app.utility");

sap.app.utility = {
	getBackendDestination : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return ("proxy/abapbackend");
		} else {
			return ("proxy/cloudbackend");
		}
	},

	getBackendImagesDestination : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return ("proxy/abapbackendimages");
		} else {
			return ("proxy/cloudbackendimages");
		}
	},

	getImagesBaseUrl : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.config.abapImagesBaseUrl);
		} else {
			return (sap.app.config.cloudImagesBaseUrl);
		}
	},

	getBackendTypeText : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.i18n.getProperty("DATA_SOURCE_INFO_ABAP_BACKEND"));
		} else {
			return (sap.app.i18n.getProperty("DATA_SOURCE_INFO_HANA_CLOUD"));
		}
	},

	getDataSourceInfoOdataServiceUrl : function() {
		var prefBackendType = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE);
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			return (sap.app.config.abapOdataServiceUrlWithLogin);
		} else {
			return (sap.app.config.cloudOdataServiceUrl);
		}
	},

	showErrorMessage : function(sErrorMessage) {
		var doShow = function() {
			sap.ui.commons.MessageBox.alert(sErrorMessage);
		};

		if (sap.ui.getCore().isInitialized()) {
			doShow();
		} else {
			sap.ui.getCore().attachInitEvent(doShow);
		}
	},
	
	getUrlVars :  function(){
		var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	 
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	 
	    //console.log(vars["href"]);
	    
	    return vars;
	},
	
	getDomainURL: function(){
		
		var tmp, domainPath;
		var path = sap.app.utility.getUrlVars();
		var indexPortalHtmlPath = path["href"];
		
		if(indexPortalHtmlPath !== undefined){
			tmp = indexPortalHtmlPath.replace("%3A", ":");
			tmp = tmp.replace('%2F%2F', '//');
			tmp = tmp.replace('%2F', '/');
			domainPath = tmp.split(".com")[0] + ".com";
		}
		else{
			tmp = path[0];
			if(tmp.indexOf(".com") == -1){
				domainPath = tmp.split("/espm-ui-reviews-web")[0];
			}
			else{
			domainPath = tmp.split(".com")[0] + ".com";
			}
		}
		
		return domainPath;

	}

};

sap.app.readExtensionOData = {

	requestCompleted : function(oEvent) {

		var oExtensionODataModel = sap.ui.getCore().getModel("extensionodatamodel");
		var oReviews = oExtensionODataModel.getProperty("/");
		var sSelectedProductId = sap.app.viewCache.get("customer-reviews").getModel().getData()["selectedProductId"];
		var oRatingInfo = sap.app.readExtensionOData.getRatingInfo(oReviews, sSelectedProductId);

		// customer reviews exists
		if (oRatingInfo.iReviewsCount > 0) {
			// set average rating value
			sap.app.viewCache.get("customer-reviews").getController().setRatingInfo(oRatingInfo);

			sap.app.viewCache.get("reviews").getController().showFilledCustomerReviewsPanel();
		} else {
			sap.app.viewCache.get("reviews").getController().showEmptyCustomerReviewsPanel();
		}
	},

	getRatingInfo : function(oReviews, sSelectedProductId) {
		var iReviewsCount = 0;
		var fRatingsSum = 0.0;
		var fAverageRating = 0.0;

		for ( var sReviewId in oReviews) {
			var oReview = oReviews[sReviewId];
			if (sSelectedProductId === oReview.ProductId) {
				iReviewsCount++;
				fRatingsSum += parseFloat(oReview.Rating);
			}
		}

		if (iReviewsCount > 0) {
			fAverageRating = fRatingsSum / iReviewsCount;
		}
		return {
			iReviewsCount : iReviewsCount,
			fAverageRating : fAverageRating
		};
	}
};
