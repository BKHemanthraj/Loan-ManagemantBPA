sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "LoanManagementBPA/workflowuimodule/model/models",
  ],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend(
      "LoanManagementBPA.workflowuimodule.Component",
      {
        metadata: {
          manifest: "json",
        },

        init: function () {
          UIComponent.prototype.init.apply(this, arguments);
          this.getRouter().initialize();
          this.setModel(models.createDeviceModel(), "device");
          this.setTaskModels();

          // Action for the 'Approve' button in My Inbox
          this.getInboxAPI().addAction(
            {
              action: "approve",
              label: "Approve",
              type: "accept",
            },
            function () {
              this.completeTask("approve");
            },
            this
          );

          // Action for the 'Reject' button in My Inbox
          this.getInboxAPI().addAction(
            {
              action: "reject",
              label: "Reject",
              type: "reject",
            },
            function () {
              this.completeTask("reject");
            },
            this
          );
        },

        setTaskModels: function () {
          var startupParameters = this.getComponentData().startupParameters;
          this.setModel(startupParameters.taskModel, "task");

          var taskContextModel = new sap.ui.model.json.JSONModel(
            this._getTaskInstancesBaseURL() + "/context"
          );
          this.setModel(taskContextModel, "context");
        },

        _getTaskInstancesBaseURL: function () {
          return (
            this._getWorkflowRuntimeBaseURL() +
            "/task-instances/" +
            this.getTaskInstanceID()
          );
        },

        _getWorkflowRuntimeBaseURL: function () {
          // This must match the route source in xs-app.json
          return "/api/public/workflow/rest/v1";
        },

        getTaskInstanceID: function () {
          return this.getModel("task").getData().InstanceID;
        },

        getInboxAPI: function () {
          var startupParameters = this.getComponentData().startupParameters;
          return startupParameters.inboxAPI;
        },

        completeTask: function (outcomeId) {
          this._patchTaskInstance(outcomeId);
        },

        _patchTaskInstance: function (outcomeId) {
          // 'decision' corresponds to the outcome ID in manifest/process builder
          var data = {
            status: "COMPLETED",
            context: this.getModel("context").getData(),
            decision: outcomeId 
          };

          jQuery.ajax({
            url: this._getTaskInstancesBaseURL(),
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(data),
            headers: {
              "X-CSRF-Token": this._fetchToken(),
            },
            success: () => {
                this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
            }
          });
        },

        _fetchToken: function () {
          var fetchedToken;
          jQuery.ajax({
            url: "/api/public/workflow/rest/v1/xsrf-token",
            method: "GET",
            async: false,
            headers: {
              "X-CSRF-Token": "Fetch",
            },
            success(result, xhr, data) {
              fetchedToken = data.getResponseHeader("X-CSRF-Token");
            },
          });
          return fetchedToken;
        }
      }
    );
  }
);