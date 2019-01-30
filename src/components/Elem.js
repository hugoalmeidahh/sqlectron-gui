import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
export const Example = styled.div`
  /* all declarations will be prefixed */
  padding: 2em 1em;
  background: papayawhip;

  /* pseudo selectors work as well */
  &:hover {
    background: palevioletred;
  }

  /* media queries are no problem */
  @media (max-width: 600px) {
    background: tomato;

    /* nested rules work as expected */
    &:hover {
      background: yellow;
    }
  }

  > p {
    /* descendant-selectors work as well, but are more of an escape hatch */
    text-decoration: underline;
  }

  /* Contextual selectors work as well */
  html.test & {
    display: none;
  }
`;
export const About = styled.div`
  max-width: 550px;
  margin: 0 auto 2em;
  padding: 0 1rem;
`;
export const LinkStyle = styled(Link)`
  &:link {
    color: #d64078;
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
    background-color: #c63b6f;
  }
`;
export const LinkToc = styled(Link)`
  width: 15em;
  margin: 0.5em;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  padding: 0.5em;
  color: white;
  background-color: #d64078;
  border: solid #b03060 1px;
  border-bottom: solid #b03060 4px;
  text-shadow: 0px 2px 0 #b03060;
  border-radius: 0.3em;
  position: relative;
  -webkit-transition: all 0.1s ease-out; /* Safari 3.2+, Chrome */
  -moz-transition: all 0.1s ease-out; /* Firefox 4-15 */
  -o-transition: all 0.1s ease-out; /* Opera 10.5â12.00 */
  transition: all 0.1s ease-out; /* Firefox 16+, Opera 12.50+ */
  &:link {
    color: white;
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
    background-color: #c63b6f;
  }

  &:active {
    border-bottom: solid #b03060 1px;
    top: 4px;
    -webkit-transition: all 0 ease-out; /* Safari 3.2+, Chrome */
    -moz-transition: all 0 ease-out; /* Firefox 4-15 */
    -o-transition: all 0 ease-out; /* Opera 10.5â12.00 */
    transition: all 0 ease-out; /* Firefox 16+, Opera 12.50+ */
  }
`;
export const NavWrapper = styled.div`
  text-align: center;
  padding: 1em 0;
  clear: both;
`;
export const A = styled.a`
  &:link {
    color: #d64078;
    text-decoration: none;
  }

  &:visited {
    color: #d64078;
  }

  &:hover {
    text-decoration: underline;
  }

  &:active {
    background-color: black;
    color: white;
  }
`;
export const LinkNav = styled(Link)`
  @media screen and (max-width: 404px) {
    width: 40%;
  }
  background-color: #d64078;
  color: white;
  border-radius: 0.3em;
  padding: 0.2em 0;
  position: relative;
  margin: 1em 1.5em 1em 1em;
  width: 10em;
  display: inline-block;
  text-decoration: none;
  border: solid #b03060 1px;
  border-bottom: solid #b03060 4px;
  text-shadow: 0px 2px 0 #b03060;
  -webkit-transition: all 0.1s ease-out; /* Safari 3.2+, Chrome */
  -moz-transition: all 0.1s ease-out; /* Firefox 4-15 */
  -o-transition: all 0.1s ease-out; /* Opera 10.5â12.00 */
  transition: all 0.1s ease-out; /* Firefox 16+, Opera 12.50+ */
  &:link {
    color: white;
    text-decoration: none;
  }

  &:hover {
    background-color: #c63b6f;
  }

  &:active {
    border-bottom: solid #b03060 1px;
    top: 4px;
    -webkit-transition: all 0 ease-out; /* Safari 3.2+, Chrome */
    -moz-transition: all 0 ease-out; /* Firefox 4-15 */
    -o-transition: all 0 ease-out; /* Opera 10.5â12.00 */
    transition: all 0 ease-out; /* Firefox 16+, Opera 12.50+ */
  }
`;
export const LinkPrev = LinkNav; //.extend`
//  margin-left: 2em;
//  margin-right:2em;
//  width: 10em;
// `;
export const LinkNext = LinkPrev;

const StartLabel = styled.span`
  position: absolute;
  color: #414142;
  line-height: 1em;
  top: 0;
  left: 0;
  background-color: ${props => props.color};
`;
const EndLabel = styled.span`
  position: absolute;
  color: #414142;
  line-height: 1em;
  background-color: ${props => props.color};
  right: 0;
  bottom: 0;
`;
export class Div extends Component<Props> {
  render() {
    const { children, ...other } = this.props;
    return <div {...other}>{children}</div>;
  }
}
export class Tag extends Component<Props> {
  static defaultProps = {
    name: 'div',
  };
  render() {
    const { name, css, children, ...other } = this.props;
    let Element = styled(name)`
      ${css}
    `;
    return <Element {...other}>{children}</Element>;
  }
}

export default class Elem extends Component<Props> {
  static defaultProps = {
    color: '#6AC5AC',
    tag: 'div',
  };
  render() {
    const { tag, css, title, color, children, ...other } = this.props;
    let Element = styled(tag)`
      border: solid ${color} 3px;
      padding: 0 0 0 0;
      margin: 0 0 0 0;
      position: relative;
    `;
    if (css) {
      Element = Element.extend`
        ${css}
      `;
    }
    let idstr, cls_str;
    if (this.props.id) {
      idstr = `id="${this.props.id}"`;
    }
    //
    if (this.props.className) {
      cls_str = `class="${this.props.className}"`;
    }
    return (
      <Element {...other}>
        <StartLabel color={color}>
          &lt;{tag} {title} {idstr} {cls_str}&gt;
        </StartLabel>
        {children}
        <EndLabel color={color}>&lt;/{tag}&gt;</EndLabel>
      </Element>
    );
  }
}
