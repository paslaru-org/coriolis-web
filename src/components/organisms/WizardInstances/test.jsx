/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import TW from '../../../utils/TestWrapper'
import WizardInstances from '.'

const wrap = props => new TW(shallow(
  // $FlowIgnore
  <WizardInstances chunkSize={6} {...props} />
), 'wInstances')

let instances = [
  { id: 'i-1', flavor_name: 'Flavor name', instance_name: 'Instance name 1', num_cpu: 3, memory_mb: 1024 },
  { id: 'i-2', flavor_name: 'Flavor name', instance_name: 'Instance name 2', num_cpu: 3, memory_mb: 1024 },
  { id: 'i-3', flavor_name: 'Flavor name', instance_name: 'Instance name 3', num_cpu: 3, memory_mb: 1024 },
]
let onChunkSizeUpdate = () => { }

describe('WizardInstances Component', () => {
  it('has correct number of instances', () => {
    let wrapper = wrap({ instances, currentPage: 1, onChunkSizeUpdate })
    expect(wrapper.find('item-', true).length).toBe(instances.length)
  })

  it('has correct instances info', () => {
    let wrapper = wrap({ instances, currentPage: 1, onChunkSizeUpdate })
    instances.forEach(instance => {
      expect(wrapper.find(`item-${instance.id}`).findText('itemName')).toBe(instance.instance_name)
      expect(wrapper.find(`item-${instance.id}`).findText('itemDetails')).toBe(`${instance.num_cpu} vCPU | ${instance.memory_mb} MB RAM | ${instance.flavor_name}`)
    })
  })

  it('renders selected instances', () => {
    let wrapper = wrap({
      instances,
      currentPage: 1,
      selectedInstances: [
        { ...instances[0] },
        { ...instances[2] },
      ],
      onChunkSizeUpdate,
    })
    expect(wrapper.findText('selInfo')).toBe('2 instances selected')
    expect(wrapper.find('item-i-1').prop('selected')).toBe(true)
    expect(wrapper.find('item-i-2').prop('selected')).toBe(false)
    expect(wrapper.find('item-i-3').prop('selected')).toBe(true)
  })

  it('renders current page', () => {
    let wrapper = wrap({ instances, currentPage: 2, chunkSize: 2, onChunkSizeUpdate })
    expect(wrapper.findText('currentPage')).toBe('2 of 2')
  })

  it('renders previous page disabled if page is 1', () => {
    let wrapper = wrap({ instances, currentPage: 1, onChunkSizeUpdate })
    expect(wrapper.find('prevPageButton').prop('disabled')).toBe(true)
  })

  it('renders previous page enabled if page is greater than 1', () => {
    let wrapper = wrap({ instances, currentPage: 3, onChunkSizeUpdate })
    expect(wrapper.find('prevPageButton').prop('disabled')).toBeFalsy()
    expect(wrapper.find('loadingStatus').length).toBe(0)
  })

  it('renders loading', () => {
    let wrapper = wrap({ instances, currentPage: 1, loading: true, onChunkSizeUpdate })
    expect(wrapper.find('loadingStatus').length).toBe(1)
  })

  it('renders searching', () => {
    let wrapper = wrap({ instances, currentPage: 1, searching: true, onChunkSizeUpdate })
    expect(wrapper.find('searchInput').prop('loading')).toBe(true)
  })

  it('renders search not found', () => {
    let wrapper = wrap({ instances: [], currentPage: 1, searchNotFound: true, onChunkSizeUpdate })
    expect(wrapper.findText('notFoundText')).toBe('Your search returned no results')
    expect(wrapper.find('loadingChunks').length).toBe(0)
  })

  it('renders loading page', () => {
    let wrapper = wrap({ instances, currentPage: 1, chunksLoading: true, onChunkSizeUpdate })
    expect(wrapper.find('loadingChunks').length).toBe(1)
  })

  it('enabled next page', () => {
    let wrapper = wrap({ instances, currentPage: 1, onChunkSizeUpdate })
    expect(wrapper.find('nextPageButton').prop('disabled')).toBe(true)
    wrapper = wrap({ instances, currentPage: 1, chunkSize: 2, onChunkSizeUpdate })
    expect(wrapper.find('nextPageButton').prop('disabled')).toBeFalsy()
  })

  it('dispatches next and previous page click, if enabled', () => {
    let onPageClick = sinon.spy()
    let wrapper = wrap({ instances, currentPage: 1, onPageClick, onChunkSizeUpdate })
    wrapper.find('nextPageButton').click()
    wrapper.find('prevPageButton').click()
    expect(onPageClick.callCount).toBe(0)
    wrapper = wrap({ instances, currentPage: 2, onPageClick, chunkSize: 1, onChunkSizeUpdate })
    wrapper.find('nextPageButton').click()
    wrapper.find('prevPageButton').click()
    expect(onPageClick.callCount).toBe(2)
  })

  it('dispaches reload click', () => {
    let onReloadClick = sinon.spy()
    let wrapper = wrap({ instances, currentPage: 1, onReloadClick, onChunkSizeUpdate })
    wrapper.find('reloadButton').click()
    expect(onReloadClick.calledOnce).toBe(true)
  })
})
