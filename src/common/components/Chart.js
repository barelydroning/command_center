import React from 'react'
import { VictoryLine, VictoryChart } from 'victory'
import COLOR from '../COLOR'

const Chart = ({title, data, domainY}) => (
  <div style={{
    width: 400
  }}>
    <div style={{
      color: COLOR.secondary
    }}>
      {title}
    </div>
    <VictoryChart

    >
      <VictoryLine
        width={800}
        domain={{y: domainY}}
        style={{
          data: { stroke: COLOR.secondary },
          parent: { border: '1px solid white' }
        }}
        data={data}
      />
    </VictoryChart>
  </div>
)

export default Chart
