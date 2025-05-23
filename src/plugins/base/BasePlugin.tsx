import React from 'react';
import { PluginResponse } from '../../types';

export abstract class BasePlugin {
  protected name: string;
  protected command: string;
  protected description: string;

  constructor(name: string, command: string, description: string) {
    this.name = name;
    this.command = command;
    this.description = description;
  }

  abstract execute(args: string[]): Promise<PluginResponse<unknown>>;

  protected renderSuccess(data: PluginResponse<unknown>): React.ReactNode {
    if (!data.data) return null;
    return <div className="p-4 bg-green-50 text-green-700 rounded-lg">{JSON.stringify(data.data, null, 2)}</div>;
  }

  protected renderError(data: PluginResponse<unknown>): React.ReactNode {
    if (!data.success) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {data.error}
        </div>
      );
    }
    return null;
  }

  public render(data: PluginResponse<unknown>): React.ReactNode {
    if (!data.success) {
      return this.renderError(data);
    }
    return this.renderSuccess(data);
  }

  public getName(): string {
    return this.name;
  }

  public getCommand(): string {
    return this.command;
  }

  public getDescription(): string {
    return this.description;
  }
}