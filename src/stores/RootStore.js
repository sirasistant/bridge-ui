import { action } from 'mobx';
import Web3Store from './Web3Store'
import HomeStore from './HomeStore'
import ForeignStore from './ForeignStore'
import AlertStore from './AlertStore'
import GasPriceStore from './GasPriceStore'
import TxStore from './TxStore'
import { abi as FOREIGN_ERC_ABI } from '../contracts/ForeignBridgeErcToErc';
import { getWeb3Instance } from './utils/web3'
import { getErc20TokenAddress } from './utils/contract'

class RootStore {
  constructor() {
    this.bridgeModeInitialized = false
    this.setBridgeMode()
    this.alertStore = new AlertStore()
    this.web3Store = new Web3Store(this)
    this.homeStore = new HomeStore(this)
    this.foreignStore = new ForeignStore(this)
    this.gasPriceStore = new GasPriceStore(this)
    this.txStore = new TxStore(this)
  }

  @action
  async setBridgeMode() {
    const foreignWeb3 = getWeb3Instance(process.env.REACT_APP_FOREIGN_BRIDGE_ADDRESS)
    const foreignBridge = new foreignWeb3.eth.Contract(FOREIGN_ERC_ABI, process.env.REACT_APP_FOREIGN_BRIDGE_ADDRESS)
    try {
      await getErc20TokenAddress(foreignBridge)
      this.isErcToErcMode = true
    } catch (e) {
      this.isErcToErcMode = false
    }
    this.bridgeModeInitialized = true
  }
}

export default new RootStore();
