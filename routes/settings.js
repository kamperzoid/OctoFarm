const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const ServerSettingsDB = require("../models/ServerSettings.js");
const ClientSettingsDB = require("../models/ClientSettings.js");
const runner = require("../runners/state.js");
const Runner = runner.Runner;

module.exports = router;

router.get("/client/get", ensureAuthenticated, (req, res) => {
  ClientSettingsDB.find({}).then(checked => {
    res.send(checked[0]);
  });
});
router.post("/client/update", ensureAuthenticated, (req, res) => {
  ClientSettingsDB.find({}).then(checked => {
    let settings = {
      backgroundURL: req.body.settings.backgroundURL
    };
    let panelView = {
      currentOp: req.body.panelView.currentOp,
      hideOff: req.body.panelView.hideOff,
      hideClosed: req.body.panelView.hideClosed
    };
    let listView = {
      currentOp: req.body.listView.currentOp,
      hideOff: req.body.listView.hideOff,
      hideClosed: req.body.listView.hideClosed
    };
    let cameraView = {
      currentOp: req.body.cameraView.currentOp,
      cameraRows: req.body.cameraView.cameraRows,
      hideClosed: req.body.cameraView.hideClosed
    };
    checked[0].settings = settings;
    checked[0].panelView = panelView;
    checked[0].listView = listView;
    checked[0].cameraView = cameraView;
    checked[0].save();
    res.send({ msg: "Settings Saved" });
  });
});

router.get("/server/get", ensureAuthenticated, (req, res) => {
  ServerSettingsDB.find({}).then(checked => {
    res.send(checked[0]);
  });
});
router.post("/server/update", ensureAuthenticated, (req, res) => {
  ServerSettingsDB.find({}).then(async checked => {
    checked[0].onlinePolling = req.body.onlinePolling;
    Runner.updatePoll();
    await checked[0].save();
    res.send({ msg: "Settings Saved" });
  });
});
