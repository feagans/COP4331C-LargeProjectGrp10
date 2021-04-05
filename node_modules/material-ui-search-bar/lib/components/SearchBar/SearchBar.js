"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Input = _interopRequireDefault(require("@material-ui/core/Input"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));

var _withStyles = _interopRequireDefault(require("@material-ui/core/styles/withStyles"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var styles = function styles(theme) {
  return {
    root: {
      height: theme.spacing(6),
      display: "flex",
      justifyContent: "space-between"
    },
    iconButton: {
      color: theme.palette.action.active,
      transform: "scale(1, 1)",
      transition: theme.transitions.create(["transform", "color"], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut
      })
    },
    iconButtonHidden: {
      transform: "scale(0, 0)",
      "& > $icon": {
        opacity: 0
      }
    },
    searchIconButton: {
      marginRight: theme.spacing(-6)
    },
    icon: {
      transition: theme.transitions.create(["opacity"], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut
      })
    },
    input: {
      width: "100%"
    },
    searchContainer: {
      margin: "auto 16px",
      width: "calc(100% - ".concat(theme.spacing(6 + 4), "px)") // 6 button + 4 margin

    }
  };
};
/**
 * Material design search bar
 * @see [Search patterns](https://material.io/archive/guidelines/patterns/search.html)
 */


var SearchBar = /*#__PURE__*/_react["default"].forwardRef(function (_ref, ref) {
  var cancelOnEscape = _ref.cancelOnEscape,
      className = _ref.className,
      classes = _ref.classes,
      closeIcon = _ref.closeIcon,
      disabled = _ref.disabled,
      onCancelSearch = _ref.onCancelSearch,
      onRequestSearch = _ref.onRequestSearch,
      searchIcon = _ref.searchIcon,
      style = _ref.style,
      inputProps = _objectWithoutProperties(_ref, ["cancelOnEscape", "className", "classes", "closeIcon", "disabled", "onCancelSearch", "onRequestSearch", "searchIcon", "style"]);

  var inputRef = _react["default"].useRef();

  var _React$useState = _react["default"].useState(inputProps.value),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  _react["default"].useEffect(function () {
    setValue(inputProps.value);
  }, [inputProps.value]);

  var handleFocus = _react["default"].useCallback(function (e) {
    if (inputProps.onFocus) {
      inputProps.onFocus(e);
    }
  }, [inputProps.onFocus]);

  var handleBlur = _react["default"].useCallback(function (e) {
    setValue(function (v) {
      return v.trim();
    });

    if (inputProps.onBlur) {
      inputProps.onBlur(e);
    }
  }, [inputProps.onBlur]);

  var handleInput = _react["default"].useCallback(function (e) {
    setValue(e.target.value);

    if (inputProps.onChange) {
      inputProps.onChange(e.target.value);
    }
  }, [inputProps.onChange]);

  var handleCancel = _react["default"].useCallback(function () {
    setValue("");

    if (onCancelSearch) {
      onCancelSearch();
    }
  }, [onCancelSearch]);

  var handleRequestSearch = _react["default"].useCallback(function () {
    if (onRequestSearch) {
      onRequestSearch(value);
    }
  }, [onRequestSearch, value]);

  var handleKeyUp = _react["default"].useCallback(function (e) {
    if (e.charCode === 13 || e.key === "Enter") {
      handleRequestSearch();
    } else if (cancelOnEscape && (e.charCode === 27 || e.key === "Escape")) {
      handleCancel();
    }

    if (inputProps.onKeyUp) {
      inputProps.onKeyUp(e);
    }
  }, [handleRequestSearch, cancelOnEscape, handleCancel, inputProps.onKeyUp]);

  _react["default"].useImperativeHandle(ref, function () {
    return {
      focus: function focus() {
        inputRef.current.focus();
      },
      blur: function blur() {
        inputRef.current.blur();
      }
    };
  });

  return /*#__PURE__*/_react["default"].createElement(_Paper["default"], {
    className: (0, _classnames["default"])(classes.root, className),
    style: style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.searchContainer
  }, /*#__PURE__*/_react["default"].createElement(_Input["default"], _extends({}, inputProps, {
    inputRef: inputRef,
    onBlur: handleBlur,
    value: value,
    onChange: handleInput,
    onKeyUp: handleKeyUp,
    onFocus: handleFocus,
    fullWidth: true,
    className: classes.input,
    disableUnderline: true,
    disabled: disabled
  }))), /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    onClick: handleRequestSearch,
    className: (0, _classnames["default"])(classes.iconButton, classes.searchIconButton, _defineProperty({}, classes.iconButtonHidden, value !== "")),
    disabled: disabled
  }, /*#__PURE__*/_react["default"].cloneElement(searchIcon, {
    classes: {
      root: classes.icon
    }
  })), /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    onClick: handleCancel,
    className: (0, _classnames["default"])(classes.iconButton, _defineProperty({}, classes.iconButtonHidden, value === "")),
    disabled: disabled
  }, /*#__PURE__*/_react["default"].cloneElement(closeIcon, {
    classes: {
      root: classes.icon
    }
  })));
});

SearchBar.defaultProps = {
  className: "",
  closeIcon: /*#__PURE__*/_react["default"].createElement(_Clear["default"], null),
  disabled: false,
  placeholder: "Search",
  searchIcon: /*#__PURE__*/_react["default"].createElement(_Search["default"], null),
  style: null,
  value: ""
};
SearchBar.propTypes = {
  /** Whether to clear search on escape */
  cancelOnEscape: _propTypes["default"].bool,

  /** Override or extend the styles applied to the component. */
  classes: _propTypes["default"].object.isRequired,

  /** Custom top-level class */
  className: _propTypes["default"].string,

  /** Override the close icon. */
  closeIcon: _propTypes["default"].node,

  /** Disables text field. */
  disabled: _propTypes["default"].bool,

  /** Fired when the search is cancelled. */
  onCancelSearch: _propTypes["default"].func,

  /** Fired when the text value changes. */
  onChange: _propTypes["default"].func,

  /** Fired when the search icon is clicked. */
  onRequestSearch: _propTypes["default"].func,

  /** Sets placeholder text for the embedded text field. */
  placeholder: _propTypes["default"].string,

  /** Override the search icon. */
  searchIcon: _propTypes["default"].node,

  /** Override the inline-styles of the root element. */
  style: _propTypes["default"].object,

  /** The value of the text field. */
  value: _propTypes["default"].string
};

var _default = (0, _withStyles["default"])(styles)(SearchBar);

exports["default"] = _default;