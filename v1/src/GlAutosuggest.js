import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { MenuItem } from "material-ui/Menu";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import { withStyles } from "material-ui/styles";

import GridList, { GridListTile } from "material-ui/GridList";
import GhCard from "./GhCard";
//import lightGreen from "material-ui/colors/lightGreen";

/*
OLD DATA SOURCE --- EVENTUALLY REMOVE
const template =
  "https://raw.githubusercontent.com/stormasm/mui-card-file/master/src/data/repos/";
*/

const num_of_item_dropdowns = 6;

const template =
  "https://raw.githubusercontent.com/stormasm/ghdata/master/data1/";

const repoMap = {
  repo1: "html5-node-diagram.json",
  repo2: "ivy.json",
  repo3: "nodejs-sandboxed-fs.json",
  repo4: "ghme.json",
  repo5: "ghme5.json",
  repo6: "ghme8.json"
};

const target_location = "repo1";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    height: 250
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  gridListSingleLine: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
    //backgroundColor: lightGreen[100]
    backgroundColor: theme.palette.background.paper
  }
});

class GridListAutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      suggestions: [],
      data: {},
      datasug: {},
      isLoading: false,
      error: null,
      repoName: repoMap[target_location]
    };
  }

  buildSuggestions(value) {
    // In the future we may only grab locations with the value
    const sugary = [];
    const sug = this.state.data.hits;
    sug.forEach(function(item, index) {
      let obj = {};
      obj.label = item.location;
      if (obj.label != null) {
        sugary.push(obj);
      }
    });
    return sugary;
  }

  buildSuggestionsData(value) {
    // Grab all of the objects in the array that match the location
    const sugary = [];
    const sug = this.state.data.hits;
    sug.forEach(function(item, index) {
      if (item.location === value.label) {
        sugary.push(item);
      }
    });

    const obj = {};
    obj.hits = sugary;
    return obj;
  }

  getSuggestions(value) {
    const mysuggestions = this.buildSuggestions(value);

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : mysuggestions.filter(suggestion => {
          const keep =
            count < num_of_item_dropdowns &&
            suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  handleSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    const mydata = this.buildSuggestionsData(suggestion);
    this.setState({
      datasug: mydata
    });
  };

  componentWillReceiveProps(nextProps) {
    const url = template + repoMap[nextProps.match.params.repo];

    this.setState({ isLoading: true });
    this.setState({ repoName: repoMap[target_location] });

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            "Sorry, but something went wrong in demo-github-json..."
          );
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.setState({ repoName: repoMap[target_location] });

    const url = template + this.state.repoName;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            "Sorry, but something went wrong in demo-github-json..."
          );
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { classes } = this.props;

    const hits = this.state.data.hits || [];
    const hitsug = this.state.datasug.hits || [];

    if (this.state.error) {
      return <p>{this.state.error.message}</p>;
    }

    if (this.state.isLoading) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        <div>
          <Autosuggest
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderInputComponent={renderInput}
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            onSuggestionSelected={this.handleSuggestionSelected}
            renderSuggestionsContainer={renderSuggestionsContainer}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              classes,
              placeholder: "Search a location starting with the first letter",
              value: this.state.value,
              onChange: this.handleChange
            }}
          />
        </div>

        <div className={classes.root}>
          <GridList
            cellHeight={250}
            className={classes.gridListSingleLine}
            cols={6}
          >
            {hitsug.map(tile => (
              <GridListTile key={tile.avatar} cols={tile.cols || 1}>
                <GhCard tile={tile} />
              </GridListTile>
            ))}
          </GridList>
        </div>

        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>login</CustomTableCell>
                  <CustomTableCell>name</CustomTableCell>
                  <CustomTableCell>location</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hits.map((key, index) => {
                  return (
                    <TableRow key={index}>
                      <CustomTableCell>
                        <a href={"https://github.com/" + key.login}>
                          {key.login}
                        </a>
                      </CustomTableCell>
                      <CustomTableCell>{key.name}</CustomTableCell>
                      <CustomTableCell>{key.location}</CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

GridListAutoSuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GridListAutoSuggest);
