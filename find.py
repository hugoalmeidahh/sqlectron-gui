# -*- coding: utf-8 -*-
import os, sys
#代码中需要用到的方法模块导入
  
listonly = False
 
skipexts = ['.gif', '.exe', '.pyc', '.o', '.a','.dll','.lib','.pdb','.mdb']        # ignore binary files
      
 
def visitfile(fname, searchKey):
    global fcount, vcount                              
    try:
        if not listonly:
            if os.path.splitext(fname)[1] in skipexts:
                pass
            elif open(fname).read().find(searchKey) != -1:
                print'%s has %s' % (fname, searchKey)
                fcount += 1
    except: 
        pass
    vcount += 1

def visitor(args, directoryName,filesInDirectory):
    for fname in filesInDirectory:                   
        fpath = os.path.join(directoryName, fname)    
        if not os.path.isdir(fpath):                   
            visitfile(fpath,args)
      
 
def searcher(startdir, searchkey):
    global fcount, vcount
    fcount = vcount = 0
    os.path.walk(startdir, visitor, searchkey)
      
 
if __name__ == '__main__':
    root="./src"
    key="electron"
    searcher(root,key)
    print 'Found in %d files, visited %d' % (fcount, vcount)