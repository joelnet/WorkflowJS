interface NodeModule {
}

declare var module: NodeModule;

if (typeof module != 'undefined')
{
    (<any>module).exports = wfjs;
}
