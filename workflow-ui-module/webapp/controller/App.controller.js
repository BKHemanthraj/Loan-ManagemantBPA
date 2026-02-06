sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("LoanManagementBPA.workflowuimodule.controller.App", {
       onInit: function () {
 
  var oData = {
    comments: [
        {
            user: "michael.johnson@northstarbank.com",
            date: "02/05/2026, 09:18:22",
            message: "Income and credit history acceptable; approved."
        },
        {
            user: "emily.carter@northstarbank.com",
            date: "02/04/2026, 14:42:10",
            message: "Policy deviations observed; unable to proceed"
        },
        {
            user: "daniel.brooks@northstarbank.com",
            date: "02/03/2026, 16:05:37",
            message: "Repayment capacity verified; approval granted."
        }
    ]
  }
 
        var oModel = new sap.ui.model.json.JSONModel(oData);
        this.getView().setModel(oModel, "context");
 
        console.log(this.getView().getModel("context").getData()); // ← check console
      }
      ,
      onOpenCommentsDialog: function () {
 
        var oTimeline = this.byId("commentsTimeline");
        oTimeline.destroyContent(); // clear previous
 
        var aComments = this.getView().getModel("context").getProperty("/comments");
 
        aComments.forEach(function (oComment) {
          oTimeline.addContent(new sap.suite.ui.commons.TimelineItem({
            userName: oComment.user,
            dateTime: oComment.date,
            text: oComment.message,
            userPicture: "sap-icon://person-placeholder"
          }));
        });
 
        this.byId("commentsDialog").open();
      }
      ,
 
      onCloseCommentsDialog: function () {
        this.byId("commentsDialog").close();
      }
 
    });
  }
);