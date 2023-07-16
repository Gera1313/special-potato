//Containers Housing: Vin Input,
var vehicleFormEl = $("#vehicle-decode");

//Vin Number Input.
var vinChoiceEl = $("#vin-input");

// Make, Model, Year:  Dropdown.
var makeField = $("#make");
var modelField = $("#model");
var yearField = $("#year");
var mileageField = $("#mileage");

// Make, Model, Year:  TextInput.
var makeTxt = $("#maketxt");
var modelTxt = $("#modeltxt");
var yearTxt = $("#yeartxt");
var mileageTxt = $("#mileagetxt");

//Vin Data: No user input.
var seriesField = $("#series");
var bodyField = $("#body");
var transField = $("#transmission");
var driveField = $("#drive-type");
var engineField = $("#engine");
var fuelTypeField = $("#fuel-type");

// Buttons: Decode, Maintenance, Recalls.
var decodeBtn = $("#decodeBtn");
var maintBtn = $("#maintBtn");
var recallBtn = $("#recallBtn");
var clearBtn = $("#clearBtn");

// Saved History Container
var historyEl = $("#history");

// Saved History Data
var saveHistoryData = [];

// Local Storage Data
var storedHistoryData = JSON.parse(localStorage.getItem("saveHistoryData"));

var year = "";
var make = "";
var model = "";
var mileage = "";

// Shorthand for $(document).ready(function() {});
// This Function Ensures functions within are called once all the DOM elements have finished rendering.
$(function () {
  // Saves Users Data in Local Storage.
  function saveHistory(make, model, year, mileage) {
    var vehicleData = {
      make: make,
      model: model,
      year: year,
      mileage: mileage,
    };
    if (saveHistoryData !== undefined) {
      for (i = 0; i < saveHistoryData.length; i++) {
        if (saveHistoryData[i].model.includes(vehicleData.model) === true) {
          var duplicateVehicle = true;
          break;
        } else {
          var duplicateVehicle = false;
        }
      }
    }
    if (duplicateVehicle === false || duplicateVehicle === undefined) {
      saveHistoryData.push(vehicleData);
      localStorage.setItem("saveHistoryData", JSON.stringify(saveHistoryData));
      renderVehicleHistory();
      // If the chosen city IS DUPLICATED do NOT store new data in local storage and clear and render history buttons.
    } else {
      $(historyEl).empty();
      renderVehicleHistory();
    }
  }

  // Creates Buttons on the Nav that will display User's History
  function renderVehicleHistory() {
    for (var i = 0; i < saveHistoryData.length; i++) {
      var historyliCon = document.createElement("li");
      var historyli = document.createElement("button");
      historyli.setAttribute("class", "historyBtn");

      historyli.dataset.make = saveHistoryData[i].make;
      historyli.dataset.model = saveHistoryData[i].model;
      historyli.dataset.year = saveHistoryData[i].year;
      historyli.dataset.mileage = saveHistoryData[i].mileage;

      historyli.textContent =
        saveHistoryData[i].make +
        " " +
        saveHistoryData[i].model +
        " " +
        saveHistoryData[i].year +
        " " +
        saveHistoryData[i].mileage;
      $(historyliCon).append(historyli);
      $("#history").append(historyliCon);
    }
    return;
  }

  // Renders options for Model Dropdown after the Make is Chosen.
  function modelDropdown() {
    year = yearField.val();
    make = makeField.val();

    $.ajax({
      url:
        "https://api.nhtsa.gov/products/vehicle/models?modelYear=" +
        year +
        "&make=" +
        make +
        "&issueType=r",
      type: "GET",
      dataType: "json",
      success: function (modelData) {
        for (var i = 0; i < modelData.results.length; i++) {
          var options = document.createElement("option");
          $(options).addClass("modelDrop");
          options.innerHTML = modelData.results[i].model;
          $(modelField).append(options);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(ajaxOptions);
        console.log(thrownError);
        if (xhr.status !== 200) {
          $(".modal").addClass("is-active");
        }
        return;
      },
    });
  }

  // Renders options for Makes Dropdown after Year is Chosen.
  function makesDropdown() {
    year = yearField.val();

    $.ajax({
      url:
        "https://api.nhtsa.gov/products/vehicle/makes?modelYear=" +
        year +
        "&issueType=r",
      type: "GET",
      dataType: "json",
      success: function (makeData) {
        for (var i = 0; i < makeData.results.length; i++) {
          var options = document.createElement("option");
          $(options).addClass("makeDrop");
          options.innerHTML = makeData.results[i].make;
          $(makeField).append(options);
        }

        $(makeField).on("change", function (event) {
          event.stopPropagation();
          $(".modelDrop").remove();
          modelDropdown();
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(ajaxOptions);
        console.log(thrownError);
        if (xhr.status !== 200) {
          $(".modal").addClass("is-active");
        }
        return;
      },
    });
  }

  // Renders options for Year Dropdown.
  function yearDropdown() {
    $.ajax({
      url: "https://api.nhtsa.gov/products/vehicle/modelYears?issueType=r",
      type: "GET",
      dataType: "json",
      success: function (yearData) {
        for (var i = yearData.results.length - 1; i >= 0; i--) {
          var options = document.createElement("option");
          $(options).addClass("yearDrop");
          options.innerHTML = yearData.results[i].modelYear;
          $(yearField).append(options);
        }

        $(yearField).on("change", function (event) {
          event.stopPropagation();
          $(".modelDrop").remove();
          $(".makeDrop").remove();
          makesDropdown();
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(ajaxOptions);
        console.log(thrownError);
        if (xhr.status !== 200) {
          $(".modal").addClass("is-active");
        }
        return;
      },
    });
  }

  // DUMMY MAINTENANCE DATA. (Actual one commented out. Costs Credits. This will save us Credits until Launch).----------------
  function dummyMaintenance(make, model, year, mileage) {
    // For rear function will need Year, Make, Model, Mileage
    var data = [
      { desc: "Change Engine Oil and Filter", due_mileage: "20000" },
      { desc: "Rotate Tires", due_mileage: "20000" },
      { desc: "Change Engine Oil and Filter", due_mileage: "30000" },
      { desc: "Change Brake Fluid", due_mileage: "30000" },
      { desc: "Change Engine Oil and Filter", due_mileage: "40000" },
      { desc: "Replace Engine Air Filter", due_mileage: "40000" },
      { desc: "Replace Cabin Air Filter", due_mileage: "40000" },
      { desc: "Replace Spark Plugs", due_mileage: "40000" },
    ];

    for (var i = 0; i < data.length; i++) {
      console.log(data[i].due_mileage);
      console.log(data[i].desc);
    }
  }

  // Obtains Recall Data and Information for Chosen Make, Model, Year---------------------------------------------------------
  function getRecallData(make, model, year) {
    $.ajax({
      url:
        "https://api.nhtsa.gov/recalls/recallsByVehicle?make=" +
        make +
        "&model=" +
        model +
        "&modelYear=" +
        year,
      type: "GET",
      dataType: "json",
      success: function (recallData) {
        console.log(recallData);

        for (var i = 0; i < recallData.results.length; i++) {
          console.log(recallData.results[i].ReportReceivedDate);
          console.log(recallData.results[i].Summary);
          console.log(recallData.results[i].Remedy);
          console.log(recallData.results[i].NHTSACampaignNumber);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(ajaxOptions);
        console.log(thrownError);
        if (xhr.status !== 200) {
          $(".modal").addClass("is-active");
        }
        return;
      },
    });
  }

  // Appends Vehicle's Vin Data to the Form
  function appendFormData(vehicleData) {
    $(yearTxt).val(vehicleData.year);
    $(makeTxt).val(vehicleData.make);
    $(modelTxt).val(vehicleData.model);
    $(seriesField).val("Series: " + vehicleData.series);
    $(bodyField).val("Body Style: " + vehicleData.body);
    $(transField).val("Transmission: " + vehicleData.trans);
    $(driveField).val("Drive Type: " + vehicleData.drive);
    $(engineField).val("Engine Cyl: " + vehicleData.cylinders);
    $(fuelTypeField).val("Fuel Type: " + vehicleData.fuel);
  }

  // Function Obtains Vehicle Information by Vin Number
  function getVinData() {
    $.ajax({
      url:
        "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" +
        chosenVin +
        "?format=json",
      type: "GET",
      dataType: "json",
      success: function (vinData) {
        let vehicleSpecs = {
          make: vinData.Results[7].Value,
          model: vinData.Results[9].Value,
          year: vinData.Results[10].Value,
          series: vinData.Results[12].Value,
          body: vinData.Results[23].Value,
          trans: vinData.Results[49].Value,
          drive: vinData.Results[51].Value,
          cylinders: vinData.Results[70].Value,
          fuel: vinData.Results[77].Value,
        };

        $("#dropdown").removeClass("visible").addClass("hidden");
        $("#textbox").removeClass("hidden").addClass("visible");
        $("#instructions").removeClass("visible").addClass("hidden");
        $("#vin-information").removeClass("hidden").addClass("visible");
        $(yearField).val(null);
        $(makeField).val(null);
        $(modelField).val(null);

        // Runs Function to Append Vehicle's Vin Data to the Form
        appendFormData(vehicleSpecs);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(ajaxOptions);
        console.log(thrownError);
        if (xhr.status !== 200) {
          $(".modal").addClass("is-active");
        }
        return;
      },
    });
  }

  // If there is saved Local Storage update our Save History Variable.
  if (storedHistoryData !== null) {
    saveHistoryData = storedHistoryData;
    renderVehicleHistory();
  }

  // Decode Vin Button: On Click - Decode Vehicle Vin.
  decodeBtn.on("click", function (event) {
    event.preventDefault();
    chosenVin = $(vinChoiceEl).val().trim();

    getVinData(chosenVin);
  });

  // Search History Button: On Click - Add Values to Form.
  $(".historyBtn").on("click", function (event) {
    event.preventDefault();
    $("#dropdown").removeClass("visible").addClass("hidden");
    $("#textbox").removeClass("hidden").addClass("visible");

    $(yearField).val(null);
    $(makeField).val(null);
    $(modelField).val(null);

    $(yearTxt).val(event.target.dataset.year);
    $(makeTxt).val(event.target.dataset.make);
    $(modelTxt).val(event.target.dataset.model);
    $(mileageTxt).val(event.target.dataset.mileage);
  });

  // Recall Button: Obtain Recall Information.
  recallBtn.on("click", function (event) {
    event.preventDefault();

    // If statement checks both forms to see which one user used and obtains that value.
    if (makeField.val() === null) {
      make = makeTxt.val().trim();
    } else {
      make = makeField.val();
    }

    if (modelField.val() === null) {
      model = modelTxt.val().trim();
    } else {
      model = modelField.val();
    }

    if (yearField.val() === null) {
      year = yearTxt.val().trim();
    } else {
      year = yearField.val();
    }
    $(historyEl).empty();
    saveHistory(make, model, year, mileage);
    // Runs Function to get Recall Data.
    getRecallData(make, model, year);
  });

  // Maintenance Button: Obtain Maintenance Information.
  maintBtn.on("click", function (event) {
    event.preventDefault();

    // If statement checks both forms to see which one user used and obtains that value.
    if (makeField.val() === null) {
      make = makeTxt.val().trim();
    } else {
      make = makeField.val();
    }

    if (modelField.val() === null) {
      model = modelTxt.val().trim();
    } else {
      model = modelField.val();
    }

    if (yearField.val() === null) {
      year = yearTxt.val().trim();
    } else {
      year = yearField.val();
    }

    if (mileageField.val() === null) {
      mileage = mileageTxt.val().trim();
    } else {
      mileage = mileageField.val();
    }
    $(historyEl).empty();
    saveHistory(make, model, year, mileage);
    dummyMaintenance(make, model, year, mileage);
  });

  // Resets our Default Homepage Layout and clears field values and local storage.
  clearBtn.on("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    $(historyEl).empty();

    $("#dropdown").removeClass("hidden").addClass("visible");
    $("#textbox").removeClass("visible").addClass("hidden");
    $("#instructions").removeClass("hidden").addClass("visible");
    $("#vin-information").removeClass("visible").addClass("hidden");

    $(yearField).val(null);
    $(makeField).val(null);
    $(modelField).val(null);
    $(yearTxt).val(null);
    $(makeTxt).val(null);
    $(modelTxt).val(null);
  });

  // Navigation Contributors Dropdown.
  $(function () {
    $("#accordion").accordion({
      active: false,
      collapsible: true,
    });
  });

  // Navigation Search History Dropdown.
  $(function () {
    $("#second-accordion").accordion({
      active: false,
      collapsible: true,
    });
  });

  // Renders our Year Dropdown Tab.
  yearDropdown();

  // Clears modal by clicking  on the background.
  $(".modal-background").on("click", function () {
    $(".modal").removeClass("is-active");
  });
});
// End of Script.

// DO NOT ERASE!!!!

// Get Maintenance: Cost 5 creds a pop. Don't run until work finished. Run Dummy maintenance
// function getMaintenance() {
//   $.ajax({
//     url:
//       "http://api.carmd.com/v3.0/maint?year=" +
//       year +
//       "&make=" +
//       make +
//       "&model=" +
//       model +
//       "&mileage=" +
//       miles +
//       "&unit=" +
//       "mi",
//     headers: {
//       "content-type": "application/json",
//       authorization: "Basic MTMwMDZmOWItMzI4ZS00NGY2LTllNjUtZjU4M2IzNDU0ZjAy",
//       "partner-token": "f6b5f0bcc60046e9b4ac768200062f4c",
//     },
//     type: "GET",
//     dataType: "json",
//     success: function (data) {
//       console.log(data);
//     },
//     error: function (xhr, ajaxOptions, thrownError) {
//       console.log(xhr.status);
//       console.log(ajaxOptions);
//       console.log(thrownError);
//       if (xhr.status !== 200) {
//         $(".modal").addClass("is-active")
//       }
//       return;
//     },
//   });
// }

// Do not run this function until ready
// getMaintenance();
