import multica from './discover/multica.js'
import symphony from './discover/symphony.js'
import okf from './discover/okf.js'
import openaiAgentsPython from './discover/openai-agents-python.js'
import pi from './discover/pi-agent.js'
import mcp from './discover/mcp.js'

const projects = [multica, symphony, okf, openaiAgentsPython, pi, mcp].sort((a, b) => b.date.localeCompare(a.date))

export default projects
