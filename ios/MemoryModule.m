//
//  MemoryModule.m
//  NativeModuleProject
//
//  Created by Raşit Çolakel on 11.10.2024.
//

#import "MemoryModule.h"
#import <mach/mach.h>
#import <mach/mach_host.h>

@implementation MemoryModule

RCT_EXPORT_MODULE(MemoryInfo);

RCT_EXPORT_METHOD(getMemoryInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  @try {
    mach_port_t host_port;
    mach_msg_type_number_t host_size;
    vm_size_t pagesize;

    host_port = mach_host_self();
    host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
    host_page_size(host_port, &pagesize);

    vm_statistics_data_t vm_stat;

    if (host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size) != KERN_SUCCESS) {
        NSLog(@"Failed to fetch vm statistics");
    }

    natural_t mem_used = (vm_stat.active_count +
                          vm_stat.inactive_count +
                          vm_stat.wire_count) * pagesize;
    natural_t mem_free = vm_stat.free_count * pagesize;
    natural_t mem_total = mem_used + mem_free;
    
    resolve(@{
      @"totalMemory": @(mem_total),
      @"availableMemory": @(mem_free),
      @"usedMemory": @(mem_used)
    });

  } @catch (NSException *exception) {
    reject(@"exception", exception.reason, nil);
  }
}


@end
