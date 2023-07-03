import { SlideFade, SlideFadeProps } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { set } from "zod"
import { InfoPanel } from "./InfoPanel"
import { dappUrl } from "../../../electron/utils/getDappUrl"

type Panel = {
  title: string
  text: string
  imageUrl?: string
}

export const InfoPanels = () => {
  const [panelIndex, setPanelIndex] = useState(0)
  const [showPanel, setShowPanel] = useState(true)
  const [panels, setPanels] = useState<Panel[]>([])
  const url = dappUrl

  useEffect(() => {
    const fetchPanels = async () => {
      const response = await fetch(`${url}/api/info-panels`)
      const panels = await response.json()
      setPanels(panels)
    }
    fetchPanels()
  }, [])
  
  const rotatePanel = useCallback(() => {
    setPanelIndex(currentIdx => (currentIdx + 1) % panels.length)
  }, [setPanelIndex, panels.length])
    
  useEffect(() => {
    if (!panels.length) return
    const interval = setInterval(() => {
      setShowPanel(false)
      setTimeout(() => {
        rotatePanel()
        setShowPanel(true)
      }, 200)
    }, 10000)
    return () => clearInterval(interval)
  }, [rotatePanel])

  const panel = panels[panelIndex]

  if (!panel) return null

  return (
    <SlideFade in={showPanel} offsetY={0} offsetX={16} style={{ height: '100%', transitionTimingFunction: 'ease-out'}}>
      <InfoPanel title={panel.title} imageUrl={panel.imageUrl} text={panel.text} />
    </SlideFade>
  )
}