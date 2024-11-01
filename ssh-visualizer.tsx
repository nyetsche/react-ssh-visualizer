import React, { useState } from 'react';
import { ArrowRight, MonitorSmartphone, Server, Shield, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const SSHVisualizer = () => {
  const [localPort, setLocalPort] = useState('8888');
  const [remotePort, setRemotePort] = useState('8000');
  const [bastionHost, setBastionHost] = useState('bastion.example.com');
  const [remoteHost, setRemoteHost] = useState('jupyter.internal');
  const [method, setMethod] = useState('forward');
  
  const generateCommand = () => {
    if (method === 'forward') {
      return `ssh -L ${localPort}:${remoteHost}:${remotePort} ${bastionHost}`;
    } else {
      return `ssh -L ${localPort}:localhost:${remotePort} -J ${bastionHost} ${remoteHost}`;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>SSH Port Forwarding Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Method Selection */}
          <div className="space-y-2">
            <Label>Connection Method</Label>
            <RadioGroup value={method} onValueChange={setMethod} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="forward" id="forward" />
                <Label htmlFor="forward">Port Forward Through Bastion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jump" id="jump" />
                <Label htmlFor="jump">Jump Host (-J)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Input Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localPort">Local Port</Label>
              <Input
                id="localPort"
                value={localPort}
                onChange={(e) => setLocalPort(e.target.value)}
                placeholder="8888"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remotePort">Remote Port</Label>
              <Input
                id="remotePort"
                value={remotePort}
                onChange={(e) => setRemotePort(e.target.value)}
                placeholder="8000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bastionHost">Bastion Host</Label>
              <Input
                id="bastionHost"
                value={bastionHost}
                onChange={(e) => setBastionHost(e.target.value)}
                placeholder="bastion.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remoteHost">Remote Host</Label>
              <Input
                id="remoteHost"
                value={remoteHost}
                onChange={(e) => setRemoteHost(e.target.value)}
                placeholder="jupyter.internal"
              />
            </div>
          </div>

          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup">
              {/* Command Display */}
              <div className="bg-gray-100 p-4 rounded-md font-mono text-sm whitespace-pre">
                {generateCommand()}
              </div>

              {/* Visual Representation */}
              {method === 'forward' ? (
                <div className="flex items-center justify-between mt-8 px-4">
                  <div className="flex flex-col items-center space-y-2">
                    <MonitorSmartphone className="w-12 h-12 text-blue-500" />
                    <div className="text-sm font-medium">Local Machine</div>
                    <div className="text-xs text-gray-500">:{localPort}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-8 h-8 text-green-500" />
                    <div className="text-xs text-gray-500">SSH Tunnel</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Shield className="w-12 h-12 text-orange-500" />
                    <div className="text-sm font-medium">{bastionHost}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-8 h-8 text-green-500" />
                    <div className="text-xs text-gray-500">Internal Forward</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Server className="w-12 h-12 text-purple-500" />
                    <div className="text-sm font-medium">{remoteHost}</div>
                    <div className="text-xs text-gray-500">:{remotePort}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 mt-8">
                  {/* Step 1: Jump Connection */}
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col items-center space-y-2">
                      <MonitorSmartphone className="w-12 h-12 text-blue-500" />
                      <div className="text-sm font-medium">Local Machine</div>
                      <div className="text-xs text-gray-500">:{localPort}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-8 h-8 text-green-500" />
                      <div className="text-xs text-gray-500">Jump Through</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Shield className="w-12 h-12 text-orange-500" />
                      <div className="text-sm font-medium">{bastionHost}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-8 h-8 text-green-500" />
                      <div className="text-xs text-gray-500">Connect To</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Server className="w-12 h-12 text-purple-500" />
                      <div className="text-sm font-medium">{remoteHost}</div>
                      <div className="text-xs text-gray-500">:{remotePort}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-6 text-sm text-gray-600">
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <p className="font-medium text-yellow-800">Key Difference in Methods:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-2 text-yellow-800">
                    <li><strong>Port Forward:</strong> Single command that tunnels through bastion to remote host</li>
                    <li><strong>Jump Host:</strong> Combined command that:
                      <ol className="list-decimal ml-4 mt-1">
                        <li>Creates port forward to remote host</li>
                        <li>Routes connection through the jump host</li>
                      </ol>
                    </li>
                  </ul>
                </div>

                <p>How the selected method works:</p>
                {method === 'forward' ? (
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    <li>Single SSH connection through bastion</li>
                    <li>Bastion forwards traffic to remote host</li>
                    <li>All traffic flows through single tunnel</li>
                  </ol>
                ) : (
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    <li>Creates direct SSH tunnel to remote host through jump host</li>
                    <li>Sets up port forwarding in the same connection</li>
                    <li>More efficient than traditional port forwarding</li>
                    <li>Cleaner network path and easier to maintain</li>
                  </ol>
                )}
              </div>
            </TabsContent>

            <TabsContent value="usage">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> Add this to your <code>~/.ssh/config</code> file for easy access:
                  </p>
                  <pre className="bg-blue-100 p-2 rounded-md mt-2 text-sm">
{method === 'forward' ? 
`Host jupyter-tunnel
    HostName ${bastionHost}
    LocalForward ${localPort} ${remoteHost}:${remotePort}
    User your-username` :
`# Jump host configuration
Host ${bastionHost}
    HostName ${bastionHost}
    User your-username

# Remote host configuration
Host ${remoteHost}
    HostName ${remoteHost}
    ProxyJump ${bastionHost}
    User your-username`}
                  </pre>
                  <p className="text-sm text-blue-800 mt-2">
                    {method === 'forward' ? 
                      `Then you can simply run: ssh jupyter-tunnel` :
                      `Then you can run: ssh -L ${localPort}:localhost:${remotePort} ${remoteHost}`
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accessing JupyterHub</h3>
                  <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                    # Open in your web browser:
                    http://localhost:{localPort}/
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <ul className="list-disc ml-4 mt-2 space-y-2">
                      <li>With jump host method, you get:
                        <ul className="list-disc ml-4 mt-1">
                          <li>Direct connection to remote host through jump server</li>
                          <li>Integrated port forwarding in single command</li>
                        </ul>
                      </li>
                      <li>Benefits of jump host approach:
                        <ul className="list-disc ml-4 mt-1">
                          <li>Simpler command structure</li>
                          <li>More efficient network path</li>
                          <li>Easier to troubleshoot connection issues</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default SSHVisualizer;
