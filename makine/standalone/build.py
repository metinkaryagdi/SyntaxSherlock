"""
SyntaxSherlock Build Script
Frontend build + PyInstaller ile exe oluşturma
"""

import subprocess
import shutil
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
STANDALONE_DIR = SCRIPT_DIR
DIST_DIR = os.path.join(STANDALONE_DIR, "dist")

def run_command(cmd, cwd=None):
    """Komutu çalıştır ve çıktıyı göster"""
    print(f"🔧 Running: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"❌ Command failed with code {result.returncode}")
        sys.exit(1)
    return result

def main():
    print("=" * 60)
    print("🔍 SyntaxSherlock Build Script")
    print("=" * 60)
    
    # 1. Scanner.py'yi kopyala
    print("\n📋 Step 1: Copying scanner.py...")
    shutil.copy(
        os.path.join(BACKEND_DIR, "scanner.py"),
        os.path.join(STANDALONE_DIR, "scanner.py")
    )
    print("✅ scanner.py copied")
    
    # 2. Frontend build
    print("\n📋 Step 2: Building frontend...")
    run_command("npm run build", cwd=FRONTEND_DIR)
    print("✅ Frontend built")
    
    # 3. Frontend dist'i static klasörüne kopyala
    print("\n📋 Step 3: Copying frontend to static folder...")
    static_dir = os.path.join(STANDALONE_DIR, "static")
    if os.path.exists(static_dir):
        shutil.rmtree(static_dir)
    shutil.copytree(
        os.path.join(FRONTEND_DIR, "dist"),
        static_dir
    )
    print("✅ Frontend copied to static/")
    
    # 4. Model dosyasını kopyala
    print("\n📋 Step 4: Copying model file...")
    model_src = os.path.join(BACKEND_DIR, "syntax_sherlock_model.pkl")
    model_dst = os.path.join(STANDALONE_DIR, "syntax_sherlock_model.pkl")
    
    if os.path.exists(model_src):
        shutil.copy(model_src, model_dst)
        print("✅ Model file copied")
    else:
        print("⚠️  Model file not found! Run 'python backend/train.py' first.")
        print("   Continuing without model...")
    
    # 5. PyInstaller ile exe oluştur
    print("\n📋 Step 5: Creating executable with PyInstaller...")
    
    # PyInstaller yüklü mü kontrol et
    try:
        import PyInstaller
    except ImportError:
        print("📦 Installing PyInstaller...")
        run_command("pip install pyinstaller")
    
    # PyInstaller komutunu çalıştır - Model exe içine gömülü!
    pyinstaller_cmd = (
        f'pyinstaller '
        f'--name "SyntaxSherlock" '
        f'--onefile '
        f'--icon "{os.path.join(STANDALONE_DIR, "icon.ico")}" '
        f'--add-data "static;static" '
        f'--add-data "scanner.py;." '
        f'--add-data "syntax_sherlock_model.pkl;." '
        f'--hidden-import "sklearn.ensemble._forest" '
        f'--hidden-import "sklearn.tree._classes" '
        f'--hidden-import "sklearn.neighbors._typedefs" '
        f'--hidden-import "sklearn.utils._cython_blas" '
        f'--hidden-import "sklearn.neighbors._quad_tree" '
        f'--hidden-import "sklearn.tree._utils" '
        f'--collect-submodules "sklearn" '
        f'--noconfirm '
        f'--clean '
        f'app.py'
    )
    
    # Icon yoksa icon parametresini çıkar
    if not os.path.exists(os.path.join(STANDALONE_DIR, "icon.ico")):
        pyinstaller_cmd = pyinstaller_cmd.replace(
            f'--icon "{os.path.join(STANDALONE_DIR, "icon.ico")}" ', ''
        )
    
    run_command(pyinstaller_cmd, cwd=STANDALONE_DIR)
    
    dist_dir = os.path.join(STANDALONE_DIR, "dist")
    exe_path = os.path.join(dist_dir, "SyntaxSherlock.exe")
    exe_size = os.path.getsize(exe_path) / (1024 * 1024)  # MB
    
    print("\n" + "=" * 60)
    print("✅ BUILD COMPLETE!")
    print("=" * 60)
    print(f"\n📁 Executable: {exe_path}")
    print(f"📦 Size: {exe_size:.1f} MB (model embedded)")
    print("\n🚀 Just run SyntaxSherlock.exe - no extra files needed!")
    print("=" * 60)

if __name__ == "__main__":
    main()

