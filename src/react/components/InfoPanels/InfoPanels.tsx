import { SlideFade, SlideFadeProps } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { set } from "zod"
import { InfoPanel } from "./InfoPanel"

const INFO_PANELS = [
  {
    title: 'EtherFan NFTs',
    icon: 'icon',
    text: 'Did you know that you can buy and sell NFTs on EtherFan? Check out the NFT Marketplace to see what is available.',
  },
  {
    title: 'Solo Staking',
    icon: 'icon',
    text: 'EtherFi is proud to sponsor a solo staking pool. You can stake your Ether and earn rewards without having to join a pool.',
  },
  {
    title: 'Free Biscuits',
    icon: 'icon',
    text: 'Not many people know this, but you can get free biscuits on EtherFi. Just click the button below to claim your free biscuits.',
  },
]

export const InfoPanels = () => {
  const [panelIndex, setPanelIndex] = useState(0)
  const [showPanel, setShowPanel] = useState(true)

  const rotatePanel = () => {
    setPanelIndex(currentIdx => (currentIdx + 1) % INFO_PANELS.length)
  }
    
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('new frame')
      setShowPanel(false)
      setTimeout(() => {
        rotatePanel()
        setShowPanel(true)
      }, 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const panel = INFO_PANELS[panelIndex]

  return (
    <SlideFade in={showPanel} offsetY={0} offsetX={16} style={{ height: '100%', transitionTimingFunction: 'ease-out'}}>
      <InfoPanel title={panel.title} icon={panel.icon} text={panel.text} />
    </SlideFade>
  )
}