import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Button,
  Link,
  AppBar,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import { authService } from "../../services/auth.service";
import jwtDecode from "jwt-decode";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
    marginRight: "20px",
  },
  myButton: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 42,
    padding: "0 25px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    marginRight: "10px",
  },
}));

export default function Header({ isAuthenticated }) {
  const classes = useStyles();
  let menuList = "";
  // let profile = {};
  const [profilePic, setProfilePic] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [authed, setAuthed] = useState(false);

  const open = Boolean(anchorEl);

  const getProfilePic = async () => {
    const parsed = JSON.parse(localStorage.getItem("jwt"));
    if (parsed) {
      const decoded = jwtDecode(parsed.token);
      try {
        const profile = await axios.get("/profile/user/" + decoded._id, {
          headers: { Authorization: `Bearer ${parsed}` },
        });
        setProfilePic(profile.data.profilePic);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setAuthed(isAuthenticated());
    getProfilePic();
  }, [isAuthenticated()]);

  // dropdown events
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // dropdown events END

  const logout = (e) => {
    authService.logout();
  };

  if (authed) {
    menuList = (
      <React.Fragment>
        <Link href="#" className={classes.toolbarLink}>
          My Jobs
        </Link>
        <Link href="#" className={classes.toolbarLink}>
          Messages
        </Link>
        <Avatar alt="Remy Sharp" src={profilePic} onClick={handleClick} />
        <Menu
          keepMounted
          open={open}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          anchorEl={anchorEl}
          PaperProps={{
            style: {
              width: "20ch",
            },
          }}
        >
          <MenuItem value={10} onClick={handleClose}>
            <Link href="/editProfile" className={classes.toolbarLink}>
              My Profile
            </Link>
          </MenuItem>
          <MenuItem value={20} onClick={handleClose}>
            <Link
              href="/login"
              className={classes.toolbarLink}
              onClick={logout}
            >
              Logout
            </Link>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  } else {
    menuList = (
      <React.Fragment>
        <Link href="#" className={classes.toolbarLink}>
          Become a Sitter
        </Link>
        <Button
          variant="outlined"
          size="small"
          href="/signup"
          className={clsx(classes.myButton)}
        >
          Sign up
        </Button>
        <Button
          variant="outlined"
          size="small"
          href="/login"
          className={clsx(classes.myButton)}
        >
          Login
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <a href="/">
            <img src={"../assets/logo.png"} alt={"dogs"} href="/dashboard" />
          </a>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="left"
            noWrap
            className={classes.toolbarTitle}
          ></Typography>
          <IconButton>
            <SearchIcon />
          </IconButton>
          {menuList}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
