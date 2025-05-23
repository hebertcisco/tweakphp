import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { ConnectionConfig } from '../../types/kubectl.type'

export const useKubectlStore = defineStore('kubectl', () => {
  let storedConnections: ConnectionConfig[] = []
  const storedConnectionsRaw = localStorage.getItem('kubectl-connections')
  if (storedConnectionsRaw) {
    storedConnections = JSON.parse(storedConnectionsRaw).map((connection: any) => {
      return normalize(connection)
    })
  }
  const connections: Ref<ConnectionConfig[]> = ref(storedConnections)
  const connecting = ref(false)

  const getConnection = (id: number): ConnectionConfig | undefined => {
    return connections.value.find(c => c.id === id)
  }

  const setConnecting = (value: any) => {
    connecting.value = value
  }

  const addConnection = (config: ConnectionConfig) => {
    connections.value.push(config)
    localStorage.setItem('kubectl-connections', JSON.stringify(connections.value))
  }

  const updateConnection = (id: number, config: ConnectionConfig): void => {
    const index = connections.value.findIndex(c => c.id === id)
    if (index !== -1) {
      connections.value[index] = config
      localStorage.setItem('kubectl-connections', JSON.stringify(connections.value))
    }
  }

  const remove = (id: number) => {
    const index = connections.value.findIndex(c => c.id === id)
    if (index !== -1) {
      connections.value.splice(index, 1)
      localStorage.setItem('kubectl-connections', JSON.stringify(connections.value))
    }
  }

  return { connections, setConnecting, connecting, remove, getConnection, addConnection, updateConnection }
})

const normalize = (connection: any): any => {
  return {
    type: 'kubectl',
    id: connection.id ?? 0,
    name: connection.name ?? '',
    color: connection.color ?? '',
    context: connection.context ?? '',
    namespace: connection.namespace ?? '',
    pod: connection.pod ?? '',
    path: connection.path ?? '',
    php: connection.php ?? '',
    client_path: connection.client_path ?? '',
  }
}
