import "date-fns";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./BookSitter.css";
// The first commit of Material-UI
const useStyles = makeStyles({
  bookSitterPaper: {
    maxWidth: "400px",
    textAlign: "center",
  },
  picker: {
    maxWidth: "130px",
  },
  bookButton: {
    background: "tomato",
    color: "white",
    width: "140px",
    height: "45px",
    margin: "15px",
  },
});
function required(displayName) {
  return function validateRequired(value) {
    return value || `${displayName} is required.`;
  };
}
function useOnMount(handler) {
  return React.useEffect(handler, []);
}

function BookSitter({ profile, userProfile }) {
  const classes = useStyles();
  const { errors, getValues, handleSubmit, register, setValue } = useForm();
  const [resErr, setResErr] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);
  const [resErrMsg, setResErrMsg] = useState("");
  const handleDateChange = (date) => {
    setValue("pickupDate", date);
    values = getValues();
  };
  const handleTimeChange = (date) => {
    setValue("pickupTime", date);
    values = getValues();
  };
  const handleDropoffDateChange = (date) => {
    setValue("dropoffDate", date);
    values = getValues();
  };
  const handleDropoffTimeChange = (date) => {
    setValue("dropoffTime", date);
    values = getValues();
  };
  const getDate = (date, time) => {
    const full = new Date();
    full.setDate(date.getDate());
    full.setFullYear(date.getFullYear());
    full.setMonth(date.getMonth());
    full.setHours(time.getHours());
    full.setMinutes(time.getMinutes());
    return full;
  };
  useOnMount(() => {
    register(
      { name: "pickupDate", type: "text" },
      { validate: required("pickup date") }
    );
    register(
      { name: "pickupTime", type: "text" },
      { validate: required("pickup time") }
    );
    register(
      { name: "dropoffDate", type: "text" },
      { validate: required("drop-off date") }
    );
    register(
      { name: "dropoffTime", type: "text" },
      { validate: required("drop-off time") }
    );
  });
  let values = getValues();
  const onSubmit = async (data) => {
    setReqSuccess(false);
    setResErr(false);
    const start = getDate(data.pickupDate, data.pickupTime);
    const end = getDate(data.dropoffDate, data.dropoffTime);
    const body = {
      userId: userProfile.user,
      sitterId: profile.user,
      start: start,
      end: end,
      accepted: false,
      declined: false,
    };
    const res = await axios.post("/request", body);
    if (res.status === 200) {
      setReqSuccess(true);
    } else {
      setResErr(true);
      setResErrMsg(res.msg);
    }
  };
  return (
    <div class="booking-container">
      <Paper className={classes.bookSitterPaper}>
        <h2 class="avail">Available</h2>
        <div className="date">
          <form class="book-sitter-form" onSubmit={handleSubmit(onSubmit)}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                name="pickupDate"
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Pickup"
                value={values.pickupDate}
                onChange={handleDateChange}
                className={classes.picker}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                error={errors.hasOwnProperty("pickupDate")}
                helperText={errors.pickupDate && errors.pickupDate.message}
              />
              <KeyboardTimePicker
                margin="normal"
                name="pickupTime"
                id="time-picker"
                label=" "
                variant="inline"
                value={values.pickupTime}
                onChange={handleTimeChange}
                className={classes.picker}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                error={errors.hasOwnProperty("pickupTime")}
                helperText={errors.pickupTime && errors.pickupTime.message}
              />
              <KeyboardDatePicker
                disableToolbar
                name="dropoffDate"
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Drop-off"
                value={values.dropoffDate}
                onChange={handleDropoffDateChange}
                className={classes.picker}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                error={errors.hasOwnProperty("dropoffDate")}
                helperText={errors.dropoffDate && errors.dropoffDate.message}
              />
              <KeyboardTimePicker
                margin="normal"
                name="dropoffTime"
                id="time-picker"
                label=" "
                variant="inline"
                value={values.dropoffTime}
                onChange={handleDropoffTimeChange}
                className={classes.picker}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                error={errors.hasOwnProperty("dropoffTime")}
                helperText={errors.dropoffTime && errors.dropoffTime.message}
              />

              <div className="button">
                <Button
                  variant="contained"
                  className={classes.bookButton}
                  type="submit"
                >
                  SEND REQUEST
                </Button>
                {resErr && <Alert severity="error">{resErrMsg}</Alert>}
                {reqSuccess && (
                  <Alert severity="success">
                    Request has been successfully submitted
                  </Alert>
                )}
              </div>
            </MuiPickersUtilsProvider>
          </form>
        </div>
      </Paper>
    </div>
  );
}
export default BookSitter;
