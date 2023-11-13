import "./App.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useCallback, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Popover from "@mui/material/Popover";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const App = () => {
  const [searchList, setSearchList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChangeTerm = useCallback((e) => {
    setSearchTerm(e.target.value);
    setAnchorEl(e.currentTarget);
  }, []);

  const handleSearchClick = useCallback(
    async (e) => {
      const result = await fetch(`http://127.0.0.1:5000/pkm/search/${searchTerm}`);
      if (result.status !== 200) {
        alert("le pokemon n'exite pas");
        return;
      }
      const resultJson = await result.json();
      setSearchResult(resultJson);
      setIsOpen(true);
    },
    [searchTerm]
  );

  const handleListItemClick = useCallback(
    async (id) => {
      const result = await fetch(`http://127.0.0.1:5000/pkm/getPkm/${id}`);
      if (result.status !== 200) {
        alert("le pokemon n'exite pas");
        return;
      }
      const resultJson = await result.json();
      setSearchList([...searchList, resultJson]);
      setIsOpen(false);
    },
    [searchList]
  );
  return (
    <Box
      sx={{
        backgroundImage: `url("./assets/background.jpg")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "2000px",
        display: "flex",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <Box sx={{ maxWidth: "1400px", width: "100%", backgroundColor: "rgba(255,255,255, 0.8)" }}>
        <Box display="flex" sx={{ px: "10px", py: "20px" }}>
          <TextField
            onChange={handleChangeTerm}
            fullWidth
            label="fullWidth"
            id="fullWidth"
            value={searchTerm}
          />
          <IconButton aria-label="search" color="primary" onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              {searchResult.map(({ name, id }) => {
                console.log(id);
                return (
                  <ListItem key={name} disablePadding>
                    <ListItemButton component="button" onClick={() => handleListItemClick(id)}>
                      <ListItemText primary={name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Popover>
        </Box>

        <Grid px={10} spacing={4} container>
          {searchList.map(({ name, image }) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia component="img" height="140" image={image} alt={name} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
