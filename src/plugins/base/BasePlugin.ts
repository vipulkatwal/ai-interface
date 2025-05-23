import { Plugin, PluginResponse } from '../../types';

export abstract class BasePlugin implements Plugin {
  constructor(
    public name: string,
    public command: string,
    public description: string
  ) {}

  abstract execute(args: string[]): Promise<PluginResponse>;

  render(data: PluginResponse): React.ReactNode {
    if (!data.success) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {data.error}
        </div>
      );
    }
    return this.renderSuccess(data);
  }

  protected abstract renderSuccess(data: PluginResponse): React.ReactNode;
}