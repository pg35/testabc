import React from "react";
import ReactDOM from "react-dom";
import { wpautop } from "./wpautop";
import "./styles.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

let loggedin = 1;
function AuthButton() {
  let history = useHistory();

  return loggedin ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          loggedin = false;
          history.push("/");
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

function A() {
  const history = useHistory();
  return (
    <button
      onClick={() => {
        loggedin = !loggedin;
        history.replace("/");
      }}
    >
      logout
    </button>
  );
}
function B() {
  let history = useHistory();
  return <p>{Date.now()}</p>;
}
function App() {
  return (
    <Router>
      <B />
      <Link to="/a">aaaa-{Date.now()}</Link> <br />
      <Link to="/b">bbb</Link>
      <br />
      <Route render={() => Date.now()} />
      <br />
      <Route render={() => <A />} />
    </Router>
  );
}
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleClick = () => {
    console.log("inputref", this.inputRef, this.inputRef.current);
    try {
      this.inputRef.current.focus();
    } catch (e) {
      console.log(e, e.message);
    }
  };
  render() {
    return [
      <input key="a" ref={this.props.newref} />,
      <button key="b" onClick={this.handleClick}>
        focus
      </button>
    ];
  }
}
function App2(props) {
  let ref = React.createRef();
  function makefocus() {
    if (ref) ref.focus();
  }
  throw new Error("custom error");
  return (
    <div>
      <Input
        newref={elem => {
          console.log("elem", elem);
          ref = elem;
        }}
      />

      <button onClick={makefocus}>2nd foucs</button>
    </div>
  );
}
function createErrorBoundry(Component, name, rethrow) {
  return class ErrorBoundry extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      console.log(name, error, error.message);
      return { hasError: true };
    }
    componentDidCatch(error, errInfo) {
      console.log(name, error, error.message, errInfo);
      if (rethrow) throw error;
    }
    render() {
      const { hasError } = this.state;
      if (hasError) return "ui has error";
      return <Component />;
    }
    static displayName = `ErrorBoundry(${Component.displayName ||
      Component.name ||
      "Component"})`;
  };
}
const WithErrorBoundry = createErrorBoundry(App2, "a", true);
const WithErrorBoundry2 = createErrorBoundry(WithErrorBoundry, "b", true);
const WithErrorBoundry3 = createErrorBoundry(WithErrorBoundry2, "c");

const withSubscription = selectData => Component => {
  class Hoc extends React.Component {
    constructor(props) {
      super(props);
      this.state = { data: selectData(props) };
    }
    render() {
      return <Component {...this.props} data={this.state.data} />;
    }
  }
  Hoc.displayName = `withSubscription(${getDisplayName(Component)})`;
  return Hoc;
};
function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}
const A1 = props => <div>{props.data}</div>;
const A1WithSubscription = withSubscription(props => props.name)(A1);
const A1WithSubscription2 = withSubscription(props => props.age)(
  A1WithSubscription
);
const AContext = React.createContext({
  d: "hello",
  f: function(v) {
    console.log("acontxt::f", v);
    this.d = v;
  }
});
const bContext = React.createContext("bbbb");
const cContext = React.createContext("ccccc");
class ContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { d: "abc" };
  }
  change = v => this.setState({ d: v });
  render() {
    return (
      <AContext.Provider value={{ d: this.state.d, f: this.change }}>
        <ContextConsumer />
      </AContext.Provider>
    );
  }
}
class ContextConsumer extends React.Component {
  static contextType = AContext;
  constructor(props) {
    super(props);
    this.input = null;
  }

  render() {
    console.log(this.context);
    return (
      <div>
        {this.context.d}{" "}
        <input
          ref={e => {
            this.input = e;
          }}
        />
        <button
          onClick={() => {
            const v = this.input.value;
            console.log(v, this.context);
            this.context.f(v);
          }}
        >
          chnage
        </button>
      </div>
    );
  }
}
let themes = {
  red: { foreground: "red", background: "grey" },
  green: { foreground: "green", background: "yellow" }
};
let ThemeContext = React.createContext({
  theme: themes.red,
  changeTheme: () => console.log("no change")
});
ThemeContext.displayName = "this is my context";
function ThemeButton(props) {
  return (
    <ThemeContext.Consumer>
      {({ theme, changeTheme }) => (
        <button
          {...props}
          style={{
            color: theme.foreground,
            background: theme.background
          }}
          onClick={changeTheme}
        >
          {props.label}
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
function ThemeButtonContainer(props) {
  const { changeTheme, ...rest } = props;
  return <ThemeButton {...rest} onClick={changeTheme} />;
}
class ContextTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { theme: themes.green, changeTheme: this.changeTheme };
  }
  changeTheme = () =>
    this.setState(state => ({
      theme: state.theme === themes.red ? themes.green : themes.red
    }));
  render() {
    const { theme, changeTheme } = this.state;
    console.log(theme, changeTheme);
    return (
      <ThemeContext.Provider value={{ theme, changeTheme }}>
        <ThemeButtonContainer label="change it" />
        <section>
          <ThemeButton
            label="click me"
            onClick={() => console.log("clicked")}
          />
        </section>
      </ThemeContext.Provider>
    );
  }
}
class LivePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subject: "", message: "", emailTemplate: "" };
  }
  componentDidMount() {
    window
      .fetch("https://www.mocky.io/v2/5dad4b562d0000a542e4b8ae")
      .then(r => r.json())
      .then(r => {
        console.log(r.emailTemplate);
        this.setState({ emailTemplate: r.emailTemplate });
      })
      .catch(e => console.log(e));
  }
  change = e => this.setState({ message: e.target.value });
  resizeIframe = iframe => {
    let height = iframe.contentWindow.document.body.scrollHeight + 24;
    height = Math.max(150, height);
    iframe.height = height + "px";
  };
  autosize = e => {
    var el = e.target;
    setTimeout(function() {
      el.style.cssText = "height:auto; padding:0";
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };
  render() {
    const { message, emailTemplate } = this.state;
    const tokens = {
      subject: '<td id="header_wrapper"><h1>',
      message: '<div id="body_content_inner">'
    };
    const email = { ...this.state, message: wpautop(this.state.message) };
    let iframeHtml = emailTemplate;
    for (var p in tokens) {
      iframeHtml = iframeHtml.replace(tokens[p], tokens[p] + email[p]);
    }
    return (
      <div id="mesblkml">
        <input onChange={e => this.setState({ subject: e.target.value })} />
        <div className="mesblkml-msgwrap">
          <div className="mesblkml-2cols">
            <div className="mesblkml-msgeditor">
              <div className="mesblkml-title">Message Editor</div>
              <textarea
                value={message}
                onChange={this.change}
                onKeyDown={this.autosize}
              />
            </div>
            <div className="mesblkml-msgpreview">
              <div className="mesblkml-title">Message Preview</div>
              <div dangerouslySetInnerHTML={{ __html: email.message }} />
            </div>
            <div className="mesblkml-msgpreview--mobile">
              Message Preview is hidden on Mobile. Please use Email Preview.
            </div>
          </div>
          <div className="mesblkml-msginfo">
            <small>
              <strong>Info</strong>
              <br />
              - Use [name] to insert customer billing name in the message e.g.
              Hi [name], ....
              <br />
              - Consecutive blank lines will be merged into single blank line in
              preview and email
              <br />
            </small>
          </div>
        </div>
        <div>
          <div className="mesblkml-title">Email Preview</div>
          <iframe
            title="text"
            srcDoc={iframeHtml}
            onLoad={e => this.resizeIframe(e.target)}
          >
            no ifrmae spported
          </iframe>
        </div>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<LivePreview />, rootElement);
