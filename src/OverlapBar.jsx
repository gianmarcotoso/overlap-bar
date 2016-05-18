import React from 'react';
import { Component } from 'react';

class OverlapBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            max: 0
        }
    }

    componentDidMount() {
        this.calculateMaxValue(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.calculateMaxValue(nextProps)
    }

    renderValueAtIndex(v, i) {
        let style = {
            width: `${v * 100 / this.state.max}%`,
            opacity: .1 / (v / this.state.max)
        }

        return this.renderBarForValueAtIndexWithStyle(v, i, style)
    }

    renderValueAtIndexWithColors(v, i, c, bg) {
        let style = {
            width: `${v * 100 / this.state.max}%`,
            color: c,
            backgroundColor: bg,
            zIndex: `${Math.floor(this.state.max - v * 100 / this.state.max)}`
        }

        return this.renderBarForValueAtIndexWithStyle(v, i, style)
    }

    renderBarForValueAtIndexWithStyle(v, i, style) {
        return (
            <div className="bar" key={i} style={style}>
                {this.props.showLabels ? (
                    <span className="bar-label">{this.props.formatLabel(v)}</span>
                ) : null}
            </div>
        )
    }

    calculateMaxValue(props) {
        let max = props.max ? props.max : props.data.reduce( (r, n) => {
            let value = n.constructor === Object ? n.value : n

            return Math.max(r, value)
        }, 0)

        if (max !== this.state.max) {
            this.setState({max})
        }
    }

    render() {
        return (
            <div className="overlap-bar">
                {this.props.data.map( (v, i) => {
                    if (v.constructor === Number) return this.renderValueAtIndex(v, i)
                    if (v.constructor === Object) return this.renderValueAtIndexWithColors(v.value, i, v.color, v.backgroundColor)
                } )}
            </div>
        );
    }
}

OverlapBar.propTypes = {
    data: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.number),
        React.PropTypes.arrayOf(React.PropTypes.shape({
            value: React.PropTypes.number,
            color: React.PropTypes.string,
            backgroundColor: React.PropTypes.string
        }))
    ]).isRequired,
    max: React.PropTypes.number,

    showLabels: React.PropTypes.bool,
    formatLabel: React.PropTypes.func
}

OverlapBar.defaultProps = {
    showLabels: false,
    formatLabel: v => v
}

export default OverlapBar;
