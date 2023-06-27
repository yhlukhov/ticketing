import { StanOptions, Stan, connect } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan

  get client() {
    if(!this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }
    return this._client
  }

  connect(clusterId: string, clientId: string, opts?: StanOptions) {
    this._client = connect(clusterId, clientId, opts)

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })
      this.client.on('error', (err) => {
        reject(err)
      })
      
    })
  }
}

export const natsWrapper = new NatsWrapper()