import test from 'tape'
import sinon from 'sinon'
import { mount } from 'enzyme'
import React from 'react'
import OverlapBar from './OverlapBar'

/* SETUP JSDOM */
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
global.navigator = {
  userAgent: 'node.js'
};

/* THE ACTUAL TESTS */
test('it renders a simple array', t => {
    let fakeData = [10, 30, 100]

    const wrapper = mount(<OverlapBar data={fakeData} />, {})
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 100)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i]}%`)
    })

    t.end()
})

test('it renders a simple array with a custom max value', t => {
    let fakeData = [10, 30, 100]

    const wrapper = mount(<OverlapBar data={fakeData} max={200} />, {})
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 200)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i] / 2}%`)
    })

    t.end()
})

test('it renders a simple array with labels', t => {
    let fakeData = [10, 30, 100]
    let formatLabel = v => `${v} %`

    const wrapper = mount(<OverlapBar data={fakeData} showLabels={true} formatLabel={formatLabel} />)
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 100)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i]}%`)

        t.ok(c.find('.bar-label'))
        t.equals(c.find('.bar-label').text(), `${fakeData[i]} %`)
    })

    t.end()
})

test('it renders an object array', t => {
    let fakeData = [{
        value: 10,
        backgroundColor: '#ff0000'
    }, {
        value: 30,
        backgroundColor: '#00ff00'
    }, {
        value: 100,
        backgroundColor: '#eeeeee'
    }]

    const wrapper = mount(<OverlapBar data={fakeData} />, {})
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 100)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i].value}%`),
        t.equals(c.props().style.backgroundColor, `${fakeData[i].backgroundColor}`)
    })

    t.end()
})

test('it renders an object array with a custom max value', t => {
    let fakeData = [{
        value: 10,
        backgroundColor: '#ff0000'
    }, {
        value: 30,
        backgroundColor: '#00ff00'
    }, {
        value: 100,
        backgroundColor: '#eeeeee'
    }]

    const wrapper = mount(<OverlapBar data={fakeData} max={200} />, {})
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 200)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i].value / 2}%`)
    })

    t.end()
})

test('it renders an object array with labels', t => {
    let fakeData = [{
        value: 10,
        backgroundColor: '#ff0000'
    }, {
        value: 30,
        backgroundColor: '#00ff00'
    }, {
        value: 100,
        backgroundColor: '#eeeeee'
    }]

    let formatLabel = v => `${v} %`

    const wrapper = mount(<OverlapBar data={fakeData} showLabels={true} formatLabel={formatLabel} />)
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 100)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i].value}%`)

        t.ok(c.find('.bar-label'))
        t.equals(c.find('.bar-label').text(), `${fakeData[i].value} %`)
    })

    t.end()
})

test('it updates the bar if the passed data changes', t => {
    let fakeData = [10, 30, 100]

    const wrapper = mount(<OverlapBar data={fakeData} />, {})
    t.equals(wrapper.find('.bar').length, 3)

    t.equals(wrapper.state().max, 100)

    wrapper.children().forEach( (c, i) => {
        t.equals(c.props().style.width, `${fakeData[i]}%`)
    })

    const spy = sinon.spy(OverlapBar.prototype, 'componentWillReceiveProps')

    fakeData[1] = 60
    wrapper.setProps({data: fakeData})

    t.ok(spy.calledOnce)
    t.equals(wrapper.childAt(1).props().style.width, '60%')

    t.end()
})
