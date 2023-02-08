# -*- mode: python ; coding: utf-8 -*-


block_cipher = None


a = Analysis(
    ['/Users/nickykhorasani/Code/etherfi-desktop/src/scripts/eth2deposit_proxy.py'],
    pathex=['/Users/nickykhorasani/Code/etherfi-desktop/src/scripts/../../dist/packages', '/Users/nickykhorasani/Code/etherfi-desktop/src/scripts/../vendors/staking-deposit-cli-2.4.0', '', '/opt/homebrew/Cellar/python@3.10/3.10.9/Frameworks/Python.framework/Versions/3.10/lib/python310.zip', '/opt/homebrew/Cellar/python@3.10/3.10.9/Frameworks/Python.framework/Versions/3.10/lib/python3.10', '/opt/homebrew/Cellar/python@3.10/3.10.9/Frameworks/Python.framework/Versions/3.10/lib/python3.10/lib-dynload', '/opt/homebrew/lib/python3.10/site-packages'],
    binaries=[],
    datas=[('/Users/nickykhorasani/Code/etherfi-desktop/src/scripts/../vendors/staking-deposit-cli-2.4.0/staking_deposit/intl', 'staking_deposit/intl')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='eth2deposit_proxy',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
