import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings as SettingsIcon, Shield, Bell, Database, User, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system preferences, integrations, and security settings
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="elevated-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    General Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh">Auto-refresh dashboard</Label>
                    <Switch id="auto-refresh" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark mode</Label>
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-alerts">Sound alerts</Label>
                    <Switch id="sound-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animation">Enable animations</Label>
                    <Switch id="animation" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="elevated-card">
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Delay Alert Threshold</Label>
                    <p className="text-sm text-muted-foreground mb-2">Alert when trains are delayed by more than:</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue="10" 
                        className="w-20 px-2 py-1 text-sm border border-border rounded bg-background"
                      />
                      <span className="text-sm">minutes</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Utilization Alert</Label>
                    <p className="text-sm text-muted-foreground mb-2">Alert when utilization exceeds:</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue="85" 
                        className="w-20 px-2 py-1 text-sm border border-border rounded bg-background"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <Card className="elevated-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">Train Management System (TMS)</p>
                          <p className="text-sm text-muted-foreground">Real-time train data feed</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">Signaling Control System</p>
                          <p className="text-sm text-muted-foreground">Signal status and control</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">Weather API</p>
                          <p className="text-sm text-muted-foreground">Weather data integration</p>
                        </div>
                      </div>
                      <Badge className="bg-warning text-warning-foreground">Limited</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Passenger Information System</p>
                          <p className="text-sm text-muted-foreground">Passenger alerts and updates</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Critical system alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for critical system issues</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Train delay notifications</Label>
                    <p className="text-sm text-muted-foreground">Alert when trains exceed delay threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weather alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications for weather-related impacts</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI recommendations</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new AI optimization suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Session Management</Label>
                    <p className="text-sm text-muted-foreground mb-3">Manage active sessions and devices</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Current session (Chrome on Windows)</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Password</Label>
                    <p className="text-sm text-muted-foreground mb-3">Change your account password</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <input 
                      id="firstName"
                      defaultValue="Ashok"
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <input 
                      id="lastName"
                      defaultValue="Sharma"
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <input 
                    id="role"
                    defaultValue="Senior Operations Controller"
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                
                <div>
                  <Label htmlFor="department">Department</Label>
                  <input 
                    id="department"
                    defaultValue="Northern Railway Division"
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                
                <Button className="btn-primary-gradient">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;