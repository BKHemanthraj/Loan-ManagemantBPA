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
              user: "privileged ",
              date: "21/01/2026, 11:04:50",
              message: "latest comment 1"
            },
            {
              user: "anonymous ",
              date: "07/01/2026, 16:04:42",
              message: " bad quality product"
            },
            {
              user: "anonymous ",
              date: "07/01/2026, 16:04:42",
              message: " comment 1234"
            }
          ]
        };
 
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